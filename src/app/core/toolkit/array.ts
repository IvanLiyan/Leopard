/*
    simplified implementation of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group
    replace when that is out of beta

    returns an object who's keys are the result of fn on each element of arr
    (with each elem of arr under the corresponding key)
*/

export const arrayGroup = <T>(
  arr: ReadonlyArray<T>,
  fn: (arg0: T) => string,
): Record<string, ReadonlyArray<T>> => {
  const result: Record<string, ReadonlyArray<T>> = {};

  arr.forEach((elem) => {
    const key = fn(elem);
    if (result[key] == undefined) {
      result[key] = [elem];
    } else {
      result[key] = [...result[key], elem];
    }
  });

  return result;
};
