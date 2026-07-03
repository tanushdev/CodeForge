function linearSearchSteps(arr, target) {
  const steps = [];
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 0, log: `Searching for ${target} in [${arr}]`, done: false });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: [...arr], pointers: { i }, highlights: [i], codeLine: 1, log: `Checking index ${i}: value = ${arr[i]}`, done: false });
    if (arr[i] === target) {
      steps.push({ array: [...arr], pointers: { i }, highlights: [i], codeLine: 2, log: `Found ${target} at index ${i}!`, done: true });
      return steps;
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 4, log: `${target} not found in array`, done: true });
  return steps;
}

function binarySearchSteps(arr, target) {
  const steps = [];
  let L = 0, R = arr.length - 1;
  steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 0, log: `Initialize L=${L}, R=${R}`, done: false });
  while (L <= R) {
    const M = Math.floor((L + R) / 2);
    steps.push({ array: [...arr], pointers: { L, M, R }, highlights: [M], codeLine: 1, log: `mid = floor((${L}+${R})/2) = ${M}`, done: false });
    if (arr[M] === target) {
      steps.push({ array: [...arr], pointers: { L, M, R }, highlights: [M], codeLine: 2, log: `arr[${M}] = ${arr[M]} == ${target}. Found!`, done: true });
      return steps;
    }
    if (arr[M] < target) {
      L = M + 1;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 3, log: `${arr[M]} < ${target}, L = ${L}`, done: false });
    } else {
      R = M - 1;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 4, log: `${arr[M]} > ${target}, R = ${R}`, done: false });
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 5, log: `L (${L}) > R (${R}). Not found`, done: true });
  return steps;
}

function selectionSortSteps(arr) {
  const steps = [];
  const a = [...arr];
  steps.push({ array: [...a], pointers: {}, highlights: [], codeLine: 0, log: `Sorting [${a}]`, done: false });
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ array: [...a], pointers: { i }, highlights: [i], codeLine: 1, log: `i=${i}, assume min at ${i} (${a[i]})`, done: false });
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ array: [...a], pointers: { i, j, min: minIdx }, highlights: [j], codeLine: 2, log: `Compare a[${j}]=${a[j]} with a[${minIdx}]=${a[minIdx]}`, done: false });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], pointers: { i, min: minIdx }, highlights: [minIdx], codeLine: 3, log: `New min at ${minIdx} (${a[minIdx]})`, done: false });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], pointers: { i }, highlights: [i, minIdx], codeLine: 4, log: `Swap a[${i}] <-> a[${minIdx}] => [${a}]`, done: false });
    }
  }
  steps.push({ array: [...a], pointers: {}, highlights: [], codeLine: 5, log: `Sorted: [${a}]`, done: true });
  return steps;
}

function twoPointerSteps(arr, target) {
  const steps = [];
  let L = 0, R = arr.length - 1;
  steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 0, log: `Find pair summing to ${target}`, done: false });
  while (L < R) {
    const sum = arr[L] + arr[R];
    steps.push({ array: [...arr], pointers: { L, R }, highlights: [L, R], codeLine: 1, log: `a[${L}]=${arr[L]} + a[${R}]=${arr[R]} = ${sum}`, done: false });
    if (sum === target) {
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [L, R], codeLine: 2, log: `Found pair: (${arr[L]}, ${arr[R]})`, done: true });
      return steps;
    }
    if (sum < target) {
      L++;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 3, log: `${sum} < ${target}, L = ${L}`, done: false });
    } else {
      R--;
      steps.push({ array: [...arr], pointers: { L, R }, highlights: [], codeLine: 4, log: `${sum} > ${target}, R = ${R}`, done: false });
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 5, log: `No pair sums to ${target}`, done: true });
  return steps;
}

function slidingWindowSteps(arr, k) {
  const steps = [];
  let maxSum = 0, windowSum = 0, start = 0;
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 0, log: `Find max sum of ${k} consecutive elements`, done: false });
  for (let end = 0; end < arr.length; end++) {
    windowSum += arr[end];
    steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: end - start + 1 }, (_, i) => start + i), codeLine: 1, log: `Add a[${end}]=${arr[end]}, window=[${arr.slice(start, end + 1)}], sum=${windowSum}`, done: false });
    if (end >= k - 1) {
      if (end === k - 1) {
        maxSum = windowSum;
        steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: k }, (_, i) => start + i), codeLine: 2, log: `First window sum=${windowSum}, maxSum=${maxSum}`, done: false });
      } else {
        maxSum = Math.max(maxSum, windowSum);
        steps.push({ array: [...arr], pointers: { start, end }, highlights: Array.from({ length: k }, (_, i) => start + i), codeLine: 3, log: `Sum=${windowSum}, maxSum=${maxSum}`, done: false });
      }
      windowSum -= arr[start];
      start++;
    }
  }
  steps.push({ array: [...arr], pointers: {}, highlights: [], codeLine: 4, log: `Maximum sum of ${k} consecutive elements = ${maxSum}`, done: true });
  return steps;
}

export const visualizations = {
  'linear-search': {
    title: 'Linear Search',
    code: [
      'for i in range(len(arr)):',
      '  if arr[i] == target:',
      '    return i',
      'return -1',
    ],
    generateSteps: linearSearchSteps,
    defaultInput: { arr: [12, 45, 8, 23, 67, 3, 91, 56], target: 23 },
    description: 'Linear search scans each element sequentially until the target is found.',
    pointerMap: { i: { color: '#3b82f6', label: 'i' } },
  },
  'binary-search': {
    title: 'Binary Search',
    code: [
      'L, R = 0, len(arr) - 1',
      'while L <= R:',
      '  M = (L + R) // 2',
      '  if arr[M] == target: return M',
      '  if arr[M] < target: L = M + 1',
      '  else: R = M - 1',
      'return -1',
    ],
    generateSteps: binarySearchSteps,
    defaultInput: { arr: [12, 18, 24, 32, 45, 56, 78], target: 32 },
    description: 'Binary search repeatedly divides the sorted array in half to find the target.',
    pointerMap: { L: { color: '#ef4444', label: 'L' }, M: { color: '#f59e0b', label: 'M' }, R: { color: '#ef4444', label: 'R' } },
  },
  'selection-sort': {
    title: 'Selection Sort',
    code: [
      'for i in range(len(arr)-1):',
      '  minIdx = i',
      '  for j in range(i+1, len(arr)):',
      '    if arr[j] < arr[minIdx]:',
      '      minIdx = j',
      '  swap arr[i], arr[minIdx]',
      'return arr',
    ],
    generateSteps: selectionSortSteps,
    defaultInput: { arr: [29, 10, 14, 37, 13, 33] },
    description: 'Selection sort repeatedly finds the minimum element and moves it to the front.',
    pointerMap: { i: { color: '#3b82f6', label: 'i' }, j: { color: '#8b5cf6', label: 'j' }, min: { color: '#10b981', label: 'min' } },
  },
  'two-pointers': {
    title: 'Two Pointers',
    code: [
      'L, R = 0, len(arr) - 1',
      'while L < R:',
      '  sum = arr[L] + arr[R]',
      '  if sum == target: return (L, R)',
      '  if sum < target: L += 1',
      '  else: R -= 1',
      'return -1',
    ],
    generateSteps: twoPointerSteps,
    defaultInput: { arr: [2, 7, 11, 15, 22, 30], target: 26 },
    description: 'Two pointers scan from both ends to find a pair summing to the target.',
    pointerMap: { L: { color: '#3b82f6', label: 'L' }, R: { color: '#ef4444', label: 'R' } },
  },
  'sliding-window': {
    title: 'Sliding Window',
    code: [
      'maxSum = 0, windowSum = 0, start = 0',
      'for end in range(len(arr)):',
      '  windowSum += arr[end]',
      '  if end >= k - 1:',
      '    maxSum = max(maxSum, windowSum)',
      '    windowSum -= arr[start]',
      '    start += 1',
      'return maxSum',
    ],
    generateSteps: slidingWindowSteps,
    defaultInput: { arr: [2, 1, 5, 1, 3, 2, 6, 1], k: 3 },
    description: 'Sliding window maintains a running sum over a fixed-size window.',
    pointerMap: { start: { color: '#3b82f6', label: 'start' }, end: { color: '#ef4444', label: 'end' } },
  },
};
