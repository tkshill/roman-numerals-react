import React from 'react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import fc from 'fast-check'
import RomanNumeral from './RomanNumerals'
import { Ok, Err } from './Result'
import App from './App';


describe('Standard unit testing our Roman Numeral', () => {
  it('should convert 5 to "V"', () => {
    const result = RomanNumeral.fromInt(5);
    expect(result.isOk() ? result.value.asString() : undefined).toBe("V");
  })

  it('should convert 555 to "DLV"', () => {
    const result = RomanNumeral.fromInt(555);
    expect(result.isOk() ? result.value.asString() : undefined).toBe("DLV");
  })

  it('should convert 1234 to "MCCXXXIV"', () => {
    const result = RomanNumeral.fromInt(555);
    expect(result.isOk() ? result.value.asString() : undefined).toBe("MCCXXXIV");
  })

  it('should reject numbers bigger than 3999', () => {
    const result = RomanNumeral.fromInt(8000);
    expect(result).toBeInstanceOf(Err);
  })

})

describe('Doing property based tests', () => {

  test('should accept values between 1 and 3999 inclusive', () => {
    const arbValidIntegers = fc.integer({ min: 1, max: 3999 })

    const testPredicate = (int: number) => {
      const result = RomanNumeral.fromInt(int);
      expect(result).toBeInstanceOf(Ok);
    }

    fc.assert(fc.property(arbValidIntegers, testPredicate), { verbose: true, endOnFailure: false })
  })

  test('should not accept values less than 1 or greater than 3999', () => {
    const arbInvalidInts = fc.integer().filter((int) => int < 1 || int >= 2000)

    const testPredicate = (int: number) => {
      const result = RomanNumeral.fromInt(int);
      expect(result).toBeInstanceOf(Err)
    }

    fc.assert(fc.property(arbInvalidInts, testPredicate), { verbose: true })
  })

  const romanregex = /^M{0,3}(CM|CD|D?C{0,4})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$/;

  test('Valid numbers should produce valid roman numeral strings', () => {
    const answerStrings =
      fc.integer({ min: 1, max: 3999 })
        .map(RomanNumeral.fromInt)
        .map(rRm => rRm instanceof Ok ? rRm.value : undefined)
        .map(rm => rm!.asString())

    const test = (rms: string) => {
      expect(rms).toMatch(romanregex)
    }

    fc.assert(fc.property(answerStrings, test), { verbose: true })
  })

  const arbPlaceMaker = (single: string, fourth: string, fifth: string, ninth: string) => {
    const arbFirsts = fc.stringOf(fc.constant(single), { minLength: 0, maxLength: 3 });
    const arbFourth = fc.constant(fourth);
    const arbFifth = fc.stringOf(fc.constant(fifth), { minLength: 0, maxLength: 1 })
    const arbNinth = fc.constant(ninth);
    const arbFirstsAndFifth = fc.tuple(arbFifth, arbFirsts).map(vis => vis[0] + vis[1]);

    return fc.oneof(arbNinth, arbFourth, arbFirstsAndFifth);
  }

  const units = arbPlaceMaker("I", "IV", "V", "IX");
  const tens = arbPlaceMaker("X", "XL", "L", "XC");
  const hundreds = arbPlaceMaker("C", "CD", "D", "CM")
  const thousands = fc.stringOf(fc.constant("M"), { minLength: 0, maxLength: 3 });

  const arbValidStrings =
    fc.tuple(thousands, hundreds, tens, units)
      .map(tup => tup[0] + tup[1] + tup[2] + tup[3])
      .filter(val => val !== "")

  test('all valid strings produce are accepted', () => {
    const testPredicate = (str: string) => {
      const result = RomanNumeral.fromString(str);
      expect(result).toBeInstanceOf(Ok);
    }

    fc.assert(fc.property(arbValidStrings, testPredicate))
  })

  test('invalid inputs should be rejected', () => {
    const arbInvalidStrings =
      fc.string().filter(s => Array.from(s.matchAll(romanregex)).length === 0)

    const testPredicate = (str: string) => {
      const result = RomanNumeral.fromString(str);
      expect(result).toBeInstanceOf(Err);
    }

    fc.assert(fc.property(arbInvalidStrings, testPredicate))
  })


  test('round trips are idempotent excepting chunks of four', () => {
    const testPredicate = (inputstr: string) => {
      const result1 = RomanNumeral.fromString(inputstr);
      expect(result1).toBeInstanceOf(Ok);

      const result2 = (result1 instanceof Ok) ? RomanNumeral.fromInt(result1.value.asInt()) : undefined;
      expect(result2).toBeInstanceOf(Ok);

      const resultstr = (result2 instanceof Ok) ? result2.value.asString() : undefined;
      expect(resultstr).toBe(inputstr);
    }

    fc.assert(fc.property(arbValidStrings, testPredicate));
  })

})



afterEach(cleanup)

describe('Integration tests with property based tests', () => {
  it('renders', () => {
    expect(render(<App />)).toBeDefined();
  })

  it('should convert integer to roman numeral', async () => {
    const { getByTestId } = render(<App />)

    fireEvent.change(getByTestId('intInput'), { target: { value: '5' } });
    fireEvent.click(getByTestId('intbutton'));

    expect((getByTestId('intResult') as HTMLParagraphElement).textContent).toBe('V')
  })

  it('should convert all numbers between 1 and 3999', async () => {
    const { getByTestId } = render(<App />)
    const arbInts = fc.integer({ min: 1, max: 3999 })

    const testPredicate = (int: number) => {
      fireEvent.change(getByTestId('intInput'), { target: { value: int.toString() } })
      fireEvent.click(getByTestId('intbutton'))

      const conversion = RomanNumeral.fromInt(int)
      const result = (getByTestId('intResult') as HTMLParagraphElement).textContent

      expect(result).toBe('value' in conversion ? conversion.value.asString() : undefined)
    }

    fc.assert(fc.property(arbInts, testPredicate))
  })
})
