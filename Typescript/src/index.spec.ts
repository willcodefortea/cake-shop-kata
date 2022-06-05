import { order, toDayOfWeek } from ".";

const A_MONDAY = new Date("2022-06-06");
const A_TUESDAY = new Date("2022-06-07");
const A_WEDNESDAY = new Date("2022-06-08");
const A_FRIDAY = new Date("2022-06-10");

test("A small cake, ordered on Monday, is delivered on Wednesday", () => {
  const result = order({
    size: "small",
    date: A_MONDAY,
  });
  expect(toDayOfWeek(result)).toBe("Wednesday");
});

test("A big cake, ordered on Monday is delivered on Thursday", () => {
  const result = order({
    size: "big",
    date: A_MONDAY,
  });
  expect(toDayOfWeek(result)).toBe("Thursday");
});

test("If a cake order is received in the morning (ie, before 12pm) then baking starts on the same day.", () => {
  const result = order({
    size: "small",
    date: A_MONDAY,
    isAm: true,
  });
  expect(toDayOfWeek(result)).toBe("Tuesday");
});

test("An order for a small cake with custom frosting, received on Monday morning, has a delivery date of Thursday.", () => {
  const result = order({
    size: "small",
    date: A_MONDAY,
    isAm: true,
    customFrosting: true,
  });
  expect(toDayOfWeek(result)).toBe("Thursday");
});

describe("Marco only works Monday-Friday.", () => {
  test("An order for a small cake received on Friday morning has a delivery date of Monday", () => {
    const result = order({
      size: "small",
      date: A_FRIDAY,
      isAm: true,
    });
    expect(toDayOfWeek(result)).toBe("Monday");
  });

  test("An order for a small cake with frosting received on Friday morning has a delivery date of Wednesday", () => {
    const result = order({
      size: "small",
      date: A_FRIDAY,
      isAm: true,
      customFrosting: true,
    });
    expect(toDayOfWeek(result)).toBe("Wednesday");
  });
});

describe("Sandro works Tuesday-Saturday.", () => {
  test("An order for a big cake with custom frosting received on Tuesday afternoon has a delivery date of Tuesday", () => {
    const result = order({
      size: "big",
      date: A_WEDNESDAY,
      isAm: true,
      customFrosting: true,
    });
    expect(toDayOfWeek(result)).toBe("Tuesday");
  });
});

describe("Fancy boxes have a lead time of 3 days.", () => {
  test("An order for a small cake with a fancy box, placed on Monday morning, has a delivery date of Wednesday", () => {
    const result = order({
      size: "small",
      date: A_MONDAY,
      isAm: true,
      fancyBox: true,
    });
    expect(toDayOfWeek(result)).toBe("Wednesday");
  });

  test("An order for a big cake with a fancy box, placed on Monday morning, has a delivery date of Wednesday", () => {
    const result = order({
      size: "big",
      date: A_MONDAY,
      isAm: true,

      fancyBox: true,
    });
    expect(toDayOfWeek(result)).toBe("Wednesday");
  });

  test("An order for a big cake with a fancy box, placed on Monday afternoon, has a delivery date of Thursday", () => {
    const result = order({
      size: "big",
      date: A_MONDAY,
      fancyBox: true,
    });
    expect(toDayOfWeek(result)).toBe("Thursday");
  });
});

describe("Decorating a cake with nuts takes 1 day.", () => {
  test("An order for a small cake with nuts placed on Monday morning has a delivery date of Wednesday", () => {
    const result = order({
      size: "small",
      date: A_MONDAY,
      isAm: true,
      hasNuts: true,
    });
    expect(toDayOfWeek(result)).toBe("Wednesday");
  });

  test("An order for a small cake with frosting placed on Monday morning has a delivery date of Friday", () => {
    const result = order({
      size: "small",
      date: A_MONDAY,
      isAm: true,
      customFrosting: true,
      hasNuts: true,
    });
    expect(toDayOfWeek(result)).toBe("Friday");
  });

  test("An order for a small cake with frosting, in a fancy box, placed on Tuesday morning, has a delivery date of Monday", () => {
    const result = order({
      size: "small",
      date: A_TUESDAY,
      isAm: true,
      customFrosting: true,
      hasNuts: true,
      fancyBox: true,
    });
    expect(toDayOfWeek(result)).toBe("Monday");
  });
});

describe("The shop closes for Christmas from the 23rd of December and is open again on the 2nd of January.", () => {
  test("A small cake ordered on the 22nd of December has a delivery date of 3rd Jan", () => {
    const result = order({
      size: "small",
      date: new Date("2018-12-22"),
    });
    expect(result).toEqual(new Date("2019-01-03"));
  });

  test("A small cake ordered on 22nd December 2021 has a delivery date of 4th of Jan", () => {
    // The shop ordinarily opens on the 2nd of January, but that's a Sunday,
    // so Marco doesn't start the cake until Monday 3rd
    const result = order({
      size: "small",
      date: new Date("2021-12-22"),
    });
    expect(result).toEqual(new Date("2022-01-04"));
  });

  test("A small cake ordered on the morning of the 21st of December has a delivery date of 22nd December", () => {
    // The shop ordinarily opens on the 2nd of January, but that's a Sunday,
    // so Marco doesn't start the cake until Monday 3rd
    const result = order({
      size: "small",
      date: new Date("2021-12-21"),
      isAm: true,
    });
    expect(result).toEqual(new Date("2021-12-22"));
  });
});

describe("Fancy boxes will continue to arrive throughout the festive period.", () => {
  test("A small cake with fancy box, ordered on the 22nd of December, has a delivery date of 3rd Jan", () => {
    const result = order({
      size: "small",
      date: new Date("2018-12-22"),
      fancyBox: true,
    });
    expect(result).toEqual(new Date("2019-01-03"));
  });

  test("A small cake with a fancy box, ordered on the 21st of December has a delivery date of 3rd January", () => {
    const result = order({
      size: "small",
      date: new Date("2018-12-21"),
      fancyBox: true,
    });
    expect(result).toEqual(new Date("2019-01-03"));
  });
});
