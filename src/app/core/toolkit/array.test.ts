import { arrayGroup } from "./array";

describe("arrayGroup", () => {
  test("group by element", () => {
    const input = [
      { name: "asparagus", type: "vegetables", quantity: 5 },
      { name: "bananas", type: "fruit", quantity: 0 },
      { name: "goat", type: "meat", quantity: 23 },
      { name: "cherries", type: "fruit", quantity: 5 },
      { name: "fish", type: "meat", quantity: 22 },
    ];
    const output = arrayGroup(input, ({ type }) => type);
    const expected = {
      vegetables: [{ name: "asparagus", type: "vegetables", quantity: 5 }],
      fruit: [
        { name: "bananas", type: "fruit", quantity: 0 },
        { name: "cherries", type: "fruit", quantity: 5 },
      ],
      meat: [
        { name: "goat", type: "meat", quantity: 23 },
        { name: "fish", type: "meat", quantity: 22 },
      ],
    };

    expect(output).toStrictEqual(expected);
  });

  test("group by complex function", () => {
    const input = [
      { name: "asparagus", type: "vegetables", quantity: 5 },
      { name: "bananas", type: "fruit", quantity: 0 },
      { name: "goat", type: "meat", quantity: 23 },
      { name: "cherries", type: "fruit", quantity: 5 },
      { name: "fish", type: "meat", quantity: 22 },
    ];
    const output = arrayGroup(input, ({ quantity }) =>
      quantity > 0 ? "greaterThan" : "lessThanEqual",
    );
    const expected = {
      greaterThan: [
        { name: "asparagus", type: "vegetables", quantity: 5 },
        { name: "goat", type: "meat", quantity: 23 },
        { name: "cherries", type: "fruit", quantity: 5 },
        { name: "fish", type: "meat", quantity: 22 },
      ],
      lessThanEqual: [{ name: "bananas", type: "fruit", quantity: 0 }],
    };

    expect(output).toStrictEqual(expected);
  });
});

export {};
