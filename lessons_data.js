[
  {
    title: 'Arrays & Prefix Sums', level: 1, xp: 50,
    use: 'Use when checking if a subarray sums to a target or finding maximum subarray sum.',
    complexity: 'Prefix sum O(n) time, O(n) space. Kadane O(n) time, O(1) space.',
    theory: 'The prefix sum technique precomputes cumulative sums so that any subarray sum can be derived from two prefix sums. If prefix[j] - prefix[i] = target, then subarray (i+1..j) sums to target. Kadane\'s algorithm maintains a running maximum-ending-here, resetting to zero when it goes negative, giving the maximum subarray sum in linear time.',
    code: `def subarray_sum(nums, target):
    prefix = 0
    seen = {0}
    for num in nums:
        prefix += num
        if prefix - target in seen:
            return True
        seen.add(prefix)
    return False

def kadane(nums):
    max_ending = max_so_far = nums[0]
    for num in nums[1:]:
        max_ending = max(num, max_ending + num)
        max_so_far = max(max_so_far, max_ending)
    return max_so_far`,
    explanation: [
      'Initialize prefix sum and a set with 0.',
      'Add each number to running prefix.',
      'Check if prefix - target was seen before.',
      'If yes, a subarray sums to target.',
      'Kadane: extend or restart subarray at each element.',
    ],
    equation: 'subarray_sum(i,j) = prefix[j] - prefix[i-1]',
    deepNotes: [
      'Prefix set must include 0 for full-array matches.',
      'Kadane handles all-negative arrays by tracking max_ending.',
      'Prefix sum requires O(n) extra space.',
      'Both algorithms run in a single linear pass.',
    ],
    dryRun: [
      'nums = [1,2,3,4,5], target = 9, prefix = 0, seen = {0}',
      'num=1: prefix=1, 1-9=-8 not in seen, seen={0,1}',
      'num=2: prefix=3, 3-9=-6 not in seen, seen={0,1,3}',
      'num=3: prefix=6, 6-9=-3 not in seen, seen={0,1,3,6}',
      'num=4: prefix=10, 10-9=1 in seen => return True (2+3+4=9)',
      'Kadane: max_ending=1, max_so_far=1',
      'num=2: max_ending=3, max_so_far=3',
      'num=5: max_ending=8, max_so_far=8 => return 15',
    ],
    interview: [
      'Prefix sum converts subarray sum to set lookup.',
      'Kadane greedily decides to extend or restart.',
      'Both achieve optimal O(n) time complexity.',
      'Edge cases: empty subarray, all negatives, target zero.',
    ],
    practice: [lc('Subarray Sum Equals K', 'medium', 'subarray-sum-equals-k'), lc('Maximum Subarray', 'medium', 'maximum-subarray')],
  },
  {
    title: 'Two Pointers', level: 2, xp: 100,
    use: 'Use when searching pairs or triplets in a sorted array for a target sum.',
    complexity: 'Time O(n^2), space O(1) excluding output.',
    theory: 'Two pointers leverage a sorted array to efficiently find pairs. For three-sum, fix one element and use two pointers on the remaining subarray. Skip duplicates to avoid duplicate triplets. The left pointer starts after the fixed element, right at the end; move inward based on sum comparison to zero.',
    code: `def three_sum(nums):
    nums.sort()
    res = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, n - 1
        while l < r:
            total = nums[i] + nums[l] + nums[r]
            if total < 0:
                l += 1
            elif total > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                while l < r and nums[r] == nums[r - 1]:
                    r -= 1
                l += 1
                r -= 1
    return res`,
    explanation: [
      'Sort array to enable two-pointer technique.',
      'Fix first element, skip duplicates.',
      'Place left after fixed, right at end.',
      'Move pointers based on sum relative to zero.',
      'When match found, skip duplicates on both sides.',
    ],
    equation: 'nums[i] + nums[l] + nums[r] = 0 with i < l < r',
    deepNotes: [
      'Sorting is O(n log n) and enables pointer movement.',
      'Duplicate skipping prevents redundant triplets.',
      'Total time dominated by O(n^2) pair search.',
      'Two-pointer reduces brute-force O(n^3) to O(n^2).',
    ],
    dryRun: [
      'nums = [-1,0,1,2,-1,-4] sorted to [-4,-1,-1,0,1,2]',
      'i=0 (-4): l=1 (-1), r=5 (2), sum=-3 < 0 => l=2',
      'l=2 (-1), r=5 (2), sum=-3 < 0 => l=3',
      'l=3 (0), r=5 (2), sum=-2 < 0 => l=4',
      'l=4 (1), r=5 (2), sum=-1 < 0, l=5 => break',
      'i=1 (-1): l=2 (-1), r=5 (2), sum=0 => [-1,-1,2]',
    ],
    interview: [
      'Sorting first enables the two-pointer pattern.',
      'Skipping duplicates is critical for correctness.',
      'This pattern extends to k-sum problems.',
      'Time complexity is O(n^2) with O(1) extra space.',
    ],
    practice: [lc('3Sum', 'medium', '3sum'), lc('Container With Most Water', 'medium', 'container-with-most-water')],
  },
  {
    title: 'Sliding Window', level: 3, xp: 150,
    use: 'Use when processing contiguous subsequences with a constraint like no repeats.',
    complexity: 'Time O(n), space O(min(m, n)) where m is character set size.',
    theory: 'Sliding window maintains two pointers defining the current window. For longest substring without repeats, expand the right pointer while tracking each character\'s last index. When a repeat appears, shrink the left pointer past the previous occurrence. The window size at each step gives candidate lengths.',
    code: `def longest_substring(s):
    last_index = {}
    left = max_len = 0
    for right, ch in enumerate(s):
        if ch in last_index and last_index[ch] >= left:
            left = last_index[ch] + 1
        last_index[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    explanation: [
      'Map stores each character\'s most recent index.',
      'Left pointer marks window start.',
      'When char repeats inside window, move left past it.',
      'Update character\'s last seen index.',
      'Track maximum window length seen.',
    ],
    equation: 'window(left, right) is valid when all chars are unique',
    deepNotes: [
      'The hash map tracks last index, not just presence.',
      'Window never shrinks below 1 (single char).',
      'Each character is processed exactly once.',
      'Algorithm handles all ASCII and Unicode characters.',
    ],
    dryRun: [
      's = \'abcabcbb\', left=0, max_len=0, last_index={}',
      'right=0(\'a\'): not in map, set last_index[\'a\']=0, max_len=1',
      'right=1(\'b\'): not in map, set last_index[\'b\']=1, max_len=2',
      'right=2(\'c\'): not in map, set last_index[\'c\']=2, max_len=3',
      'right=3(\'a\'): in map at 0 >= left, left=1, last_index[\'a\']=3',
      'right=4(\'b\'): in map at 1 >= left, left=2, last_index[\'b\']=4',
      'right=5(\'c\'): in map at 2 >= left, left=3, last_index[\'c\']=5',
      'right=6(\'b\'): in map at 4 >= left=3, left=5, max_len=3',
      'right=7(\'b\'): in map at 6 >= left=5, left=7, max_len=3 => return 3',
    ],
    interview: [
      'Each element enters and leaves sliding window once.',
      'Hash map enables O(1) duplicate detection.',
      'Variable window expands and contracts dynamically.',
      'Works on streams with O(n) time and O(k) space.',
    ],
    practice: [lc('Longest Substring Without Repeating Characters', 'medium', 'longest-substring-without-repeating-characters'), lc('Minimum Window Substring', 'hard', 'minimum-window-substring')],
  },
  {
    title: 'Hash Maps & Sets', level: 4, xp: 200,
    use: 'Use when you need fast lookup, counting, or grouping of elements.',
    complexity: 'Time O(n) average, space O(n).',
    theory: 'Hash maps provide O(1) average-case insertion and lookup. For Two Sum, store each number\'s index as you iterate, and check if the complement (target - num) already exists. For Group Anagrams, sort each string to form a key and group original strings by that key in a hash map.',
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

def group_anagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
    explanation: [
      'Store each number with its index in hash map.',
      'Check if complement exists before storing current.',
      'Sort each string to create anagram key.',
      'Group all strings with same sorted key.',
    ],
    equation: 'For each num, check if target - num exists in map.',
    deepNotes: [
      'One-pass hash map avoids O(n^2) brute force.',
      'Anagram key via sorting is O(k log k) per word.',
      'Hash map collisions degrade to O(n) worst case.',
      'Character-count key is an O(k) alternative for anagrams.',
    ],
    dryRun: [
      'nums = [2,7,11,15], target = 9, seen = {}',
      'i=0, num=2: complement=7 not in seen, seen={2:0}',
      'i=1, num=7: complement=2 in seen => return [0,1]',
      'Group anagrams: strs = [\'eat\',\'tea\',\'tan\']',
      '\'eat\' sorted => \'aet\', groups: {aet: [\'eat\']}',
      '\'tea\' sorted => \'aet\', groups: {aet: [\'eat\',\'tea\']}',
      'Final: [[\'eat\',\'tea\'], [\'tan\']]',
    ],
    interview: [
      'Hash map enables single-pass two-sum solution.',
      'Anagram key groups transform-equivalent strings.',
      'Trade-off: O(n) space for O(1) average lookup.',
      'Character frequency array can replace sorting for anagrams.',
    ],
    practice: [lc('Two Sum', 'easy', 'two-sum'), lc('Group Anagrams', 'medium', 'group-anagrams')],
  },
  {
    title: 'Linked Lists', level: 5, xp: 250,
    use: 'Use when data is sequential but requires O(1) insertions or deletions.',
    complexity: 'Time O(n), space O(1) for all three operations.',
    theory: 'Linked lists store nodes with value and next pointer. Reversal rewires each node\'s next to point backward. Merging compares heads and links the smaller node. Cycle detection (Floyd\'s algorithm) uses slow and fast pointers — if they meet, a cycle exists.',
    code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val < l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    explanation: [
      'Reverse: save next, rewire current, advance.',
      'Merge: dummy head simplifies edge cases.',
      'Attach remaining nodes after one list exhausts.',
      'Cycle: fast moves twice speed of slow.',
      'Meeting of slow and fast confirms cycle.',
    ],
    equation: 'Floyd: if cycle exists, slow and fast meet in O(n).',
    deepNotes: [
      'Reversal uses three pointers: prev, curr, nxt.',
      'Dummy node pattern eliminates null checks in merge.',
      'Floyd\'s algorithm uses O(1) extra space.',
      'Cycle detection also works to find cycle start.',
    ],
    dryRun: [
      'Reverse 1->2->3->4: prev=None, curr=1',
      'nxt=2, 1.next=None, prev=1, curr=2',
      'nxt=3, 2.next=1, prev=2, curr=3',
      'nxt=4, 3.next=2, prev=3, curr=4',
      'nxt=None, 4.next=3, prev=4, curr=None => 4->3->2->1',
      'Merge [1,3] and [2,4]: dummy->1->2->3->4',
      'Cycle: slow=1, fast=2, then slow=2, fast=4, then slow=3, fast=3 => cycle detected',
    ],
    interview: [
      'Reversal rewires pointers in-place.',
      'Dummy head unifies merge logic.',
      'Floyd uses O(1) space versus hash set O(n).',
      'All three are fundamental linked list patterns.',
    ],
    practice: [lc('Reverse Linked List', 'easy', 'reverse-linked-list'), lc('Merge Two Sorted Lists', 'easy', 'merge-two-sorted-lists')],
  },
  {
    title: 'Stacks & Queues', level: 6, xp: 300,
    use: 'Use when processing nested structures or finding next greater/smaller element.',
    complexity: 'Time O(n), space O(n).',
    theory: 'A stack provides LIFO (last-in-first-out) access. For parentheses validation, push opening brackets onto the stack and pop when matching closing bracket is found. A monotonic stack maintains elements in sorted order; for daily temperatures, it finds the next warmer day by storing indices of decreasing temperatures.',
    code: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
    return not stack

def daily_temperatures(temps):
    n = len(temps)
    res = [0] * n
    stack = []
    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            idx = stack.pop()
            res[idx] = i - idx
        stack.append(i)
    return res`,
    explanation: [
      'Map closing brackets to their opening pair.',
      'Push opens onto stack, pop on matching close.',
      'Mismatch or leftover means invalid string.',
      'Monotonic stack stores indices of decreasing temps.',
      'Pop when warmer found, set result to day difference.',
    ],
    equation: 'Valid iff stack is empty after processing all chars.',
    deepNotes: [
      'Stack solves nested structure problems naturally.',
      'Monotonic stack computes next greater element in O(n).',
      'Bracket validation uses constant space for pair map.',
      'Daily temps extends to next greater/smaller element pattern.',
    ],
    dryRun: [
      's = \'([{}])\', push \'(\', push \'[\', push \'{\'',
      'ch=\'}\': matches top \'{\', pop. stack=[\'(\', \'[\']',
      'ch=\']\': matches top \'[\', pop. stack=[\'(\']',
      'ch=\')\': matches top \'(\', pop. stack=[] => valid',
      'temps = [73,74,75,71,69,72,76,73]',
      'i=0: stack=[0]', 'i=1 (74>73): pop 0, res[0]=1, stack=[1]',
      'i=2 (75>74): pop 1, res[1]=1, stack=[2]',
      'i=6 (76>72): pop 5(72), res[5]=1; pop 4(69), res[4]=2; pop 3(71), res[3]=3; pop 2(75), res[2]=4',
    ],
    interview: [
      'Stack naturally pairs opening and closing brackets.',
      'Monotonic stack finds next greater element efficiently.',
      'Each element pushed and popped at most once.',
      'Pattern extends to stock span, histogram, rainwater.',
    ],
    practice: [lc('Valid Parentheses', 'easy', 'valid-parentheses'), lc('Daily Temperatures', 'medium', 'daily-temperatures')],
  },
  {
    title: 'Binary Search', level: 7, xp: 350,
    use: 'Use on sorted arrays to find a target or on rotated arrays to find inflection.',
    complexity: 'Time O(log n), space O(1).',
    theory: 'Binary search repeatedly divides the search space in half. Classic binary search compares target to the middle element and discards the half that cannot contain the target. For rotated sorted arrays, determine which half is sorted, then check if the target lies in that sorted half to decide search direction.',
    code: `def binary_search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1

def search_rotated(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1`,
    explanation: [
      'Compute mid, check equality, narrow interval.',
      'Left half sorted if nums[l] <= nums[mid].',
      'Check if target lies in sorted left half.',
      'Otherwise search the right half.',
      'Mirror logic for right-half-sorted case.',
    ],
    equation: 'If sorted portion contains target, search there; else search the other half.',
    deepNotes: [
      'O(log n) time from halving the search space.',
      'Rotated array works by identifying sorted segment.',
      'Edge: single element, target at pivot, target absent.',
      'Duplicate values require linear fallback in worst case.',
    ],
    dryRun: [
      'nums = [4,5,6,7,0,1,2], target = 0',
      'l=0(4), r=6(2), mid=3(7), 7 != 0',
      '4<=7 (left sorted), 0 not in [4,7) => l=4(0)',
      'l=4(0), r=6(2), mid=5(1), 1 != 0',
      '0<=1 (left sorted), 0 in [0,1) => r=4',
      'l=4(0), r=4(0), mid=4(0), 0==0 => return 4',
    ],
    interview: [
      'Binary search halves search space each iteration.',
      'Rotated search depends on sorted half identification.',
      'Always check mid against boundaries for pivot.',
      'Edge cases: empty array, duplicates, single element.',
    ],
    practice: [lc('Binary Search', 'easy', 'binary-search'), lc('Search in Rotated Sorted Array', 'medium', 'search-in-rotated-sorted-array')],
  },
  {
    title: 'Strings & KMP', level: 8, xp: 400,
    use: 'Use when searching for a pattern in a text with O(n+m) time avoiding backtracking.',
    complexity: 'Time O(n + m), space O(m) where m is pattern length.',
    theory: 'The Knuth-Morris-Pratt algorithm preprocesses the pattern to build a Longest Prefix Suffix (LPS) array. When a mismatch occurs, KMP uses the LPS array to skip characters already matched, avoiding redundant comparisons. This gives linear time regardless of text or pattern content.',
    code: `def build_lps(pattern):
    lps = [0] * len(pattern)
    j = 0
    for i in range(1, len(pattern)):
        while j > 0 and pattern[i] != pattern[j]:
            j = lps[j - 1]
        if pattern[i] == pattern[j]:
            j += 1
            lps[i] = j
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return 0
    lps = build_lps(pattern)
    j = 0
    for i in range(len(text)):
        while j > 0 and text[i] != pattern[j]:
            j = lps[j - 1]
        if text[i] == pattern[j]:
            j += 1
        if j == len(pattern):
            return i - j + 1
    return -1`,
    explanation: [
      'LPS[i] is longest proper prefix matching suffix ending at i.',
      'Build LPS by comparing pattern to itself.',
      'On mismatch, fall back using LPS to skip characters.',
      'Text pointer never moves backward.',
      'Match found when j reaches pattern length.',
    ],
    equation: 'LPS[i] = length of longest proper prefix of pattern[0..i] that is also a suffix.',
    deepNotes: [
      'KMP guarantees O(n+m) worst-case time.',
      'Text pointer i never decrements.',
      'LPS construction is O(m) using two pointers.',
      'Naive approach is O(n*m) worst case.',
    ],
    dryRun: [
      'text = \'abcababcabc\', pattern = \'abcabc\'',
      'Build LPS for \'abcabc\': [0,0,0,1,2,3]',
      'i=0(\'a\'): j=0, match j=1', 'i=1(\'b\'): match j=2',
      'i=2(\'c\'): match j=3', 'i=3(\'a\'): match j=4',
      'i=4(\'b\'): match j=5', 'i=5(\'a\'): \'a\'!=\'c\', j=lps[4]=2',
      'text[5]=\'a\' == pattern[2]=\'c\'? No, j=lps[1]=0',
      'text[5]=\'a\' == pattern[0]=\'a\'? Yes, j=1',
      'i=9(\'c\'): match j=6 => len=6, return 9-6+1=4',
    ],
    interview: [
      'LPS array stores fallback positions for pattern.',
      'Text pointer never backtracks.',
      'KMP achieves optimal O(n+m) worst-case.',
      'Ideal for streaming or large-text search.',
    ],
    practice: [lc('Find the Index of the First Occurrence in a String', 'medium', 'find-the-index-of-the-first-occurrence-in-a-string'), lc('Repeated Substring Pattern', 'easy', 'repeated-substring-pattern')],
  },
  {
    title: 'Binary Trees & BST', level: 9, xp: 450,
    use: 'Use for hierarchical data, sorted traversal, and BST validation.',
    complexity: 'Time O(n) for traversal and validation, space O(h) where h is tree height.',
    theory: 'Binary trees support in-order traversal (left-root-right) that visits elements in sorted order for BSTs. Iterative in-order uses a stack to simulate recursion. BST validation checks that each node\'s value lies within a valid range (min, max) derived from ancestors.',
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_recursive(root):
    res = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        res.append(node.val)
        dfs(node.right)
    dfs(root)
    return res

def inorder_iterative(root):
    res, stack = [], []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(curr.val)
        curr = curr.right
    return res

def is_valid_bst(root):
    def validate(node, lo, hi):
        if not node:
            return True
        if not (lo < node.val < hi):
            return False
        return (validate(node.left, lo, node.val) and
                validate(node.right, node.val, hi))
    return validate(root, float('-inf'), float('inf'))`,
    explanation: [
      'Recursive inorder goes left, visit, right.',
      'Iterative uses stack to avoid recursion depth limit.',
      'BST validation sets allowed range per node.',
      'Left descendants must be less than node\'s value.',
      'Right descendants must be greater than node\'s value.',
    ],
    equation: 'Valid BST: left.val < node.val < right.val for all nodes.',
    deepNotes: [
      'Recursive inorder uses O(h) stack space.',
      'Iterative inorder is useful for deep trees.',
      'BST validation tracks min/max bounds recursively.',
      'Inorder of BST yields sorted ascending array.',
    ],
    dryRun: [
      'Tree: [2,1,3], root=2 with left=1, right=3',
      'Inorder: dfs(2) -> dfs(1) -> dfs(None) return',
      'append 1, dfs(None) return, append 2',
      'dfs(3) -> dfs(None) return, append 3 => [1,2,3]',
      'Validate root=2: lo=-inf, hi=inf, 2 valid',
      'validate(left=1): lo=-inf, hi=2, 1 valid',
      'validate(right=3): lo=2, hi=inf, 3 valid => True',
    ],
    interview: [
      'Inorder traversal visits in sorted order for BST.',
      'Iterative traversal avoids recursion depth issues.',
      'Range-based validation propagates constraints downward.',
      'All operations are O(n) time and O(h) space.',
    ],
    practice: [lc('Binary Tree Inorder Traversal', 'easy', 'binary-tree-inorder-traversal'), lc('Validate Binary Search Tree', 'medium', 'validate-binary-search-tree')],
  },
  {
    title: 'Heaps & Priority Queues', level: 10, xp: 500,
    use: 'Use when you need the k largest or smallest elements efficiently.',
    complexity: 'Time O(n log k), space O(n + k).',
    theory: 'A heap is a complete binary tree that maintains the min or max element at the root. For Top K Frequent, count frequencies with a hash map, then use a min-heap of size k to keep the k most frequent elements. For Kth Smallest in a sorted matrix, use a min-heap starting from the first column and expand row-by-row.',
    code: `def top_k_frequent(nums, k):
    from collections import Counter
    import heapq
    freq = Counter(nums)
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]

def kth_smallest(matrix, k):
    import heapq
    n = len(matrix)
    heap = []
    for i in range(min(n, k)):
        heapq.heappush(heap, (matrix[i][0], i, 0))
    for _ in range(k):
        val, r, c = heapq.heappop(heap)
        if c + 1 < n:
            heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))
    return val`,
    explanation: [
      'Count frequencies with Counter hash map.',
      'Push count-element pairs into min-heap.',
      'Pop when heap exceeds k to keep top k.',
      'For matrix, push first column elements.',
      'Pop k times, pushing next column element each pop.',
    ],
    equation: 'Min-heap of size k keeps k largest elements by frequency.',
    deepNotes: [
      'Min-heap of size k gives O(n log k) instead of O(n log n).',
      'Matrix approach merges rows like k-way merge.',
      'Heap push/pop is O(log k) per operation.',
      'Counter provides O(n) frequency collection.',
    ],
    dryRun: [
      'nums = [1,1,1,2,2,3], k = 2',
      'freq = {1:3, 2:2, 3:1}',
      'heap push (3,1): heap=[(3,1)]',
      'heap push (2,2): heap=[(2,2),(3,1)]',
      'heap push (1,3): heap=[(1,3),(3,1),(2,2)]',
      'size > 2, pop (1,3): heap=[(2,2),(3,1)]',
      'Result: [2,1] (order by freq: 1 and 2)',
      'Matrix [[1,5,9],[10,11,13],[12,13,15]], k=8',
      'Push (1,0,0), (10,1,0), (12,2,0)',
      'Pop 1, push (5,0,1). Pop 5, push (9,0,2)',
      'Continue to 8th pop => return 13',
    ],
    interview: [
      'Min-heap of fixed size k tracks top k elements.',
      'Heap replaces full sort for better efficiency.',
      'Matrix k-th smallest uses k-way merge pattern.',
      'Each heap operation costs O(log k).',
    ],
    practice: [lc('Top K Frequent Elements', 'medium', 'top-k-frequent-elements'), lc('Kth Smallest Element in a Sorted Matrix', 'medium', 'kth-smallest-element-in-a-sorted-matrix')],
  },
  {
    title: 'Graph BFS/DFS', level: 11, xp: 550,
    use: 'Use for graph connectivity (DFS) and shortest path in unweighted graphs (BFS).',
    complexity: 'Time O(V + E), space O(V) for visited set and recursion/queue.',
    theory: 'DFS explores a graph by going as deep as possible before backtracking. For Number of Islands, DFS sinks connected land cells. BFS explores level by level, ideal for shortest path in unweighted graphs. For Word Ladder, BFS transforms begin word to end word one letter at a time through the word list.',
    code: `def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count

def ladder_length(begin, end, wordList):
    from collections import deque
    words = set(wordList)
    if end not in words:
        return 0
    q = deque([(begin, 1)])
    while q:
        word, dist = q.popleft()
        if word == end:
            return dist
        for i in range(len(word)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + ch + word[i+1:]
                if nxt in words:
                    words.remove(nxt)
                    q.append((nxt, dist + 1))
    return 0`,
    explanation: [
      'DFS sinks connected land by setting \'1\' to \'0\'.',
      'Each DFS call explores one full island.',
      'Count increments for each new land cell found.',
      'BFS uses queue for level-order traversal.',
      'Word Ladder generates all one-letter transformations.',
    ],
    equation: 'Number of islands = number of DFS calls triggered by unvisited land.',
    deepNotes: [
      'DFS mutates grid to mark visited cells in-place.',
      'BFS guarantees shortest path in unweighted graph.',
      'Word Ladder prunes visited words from set.',
      'Both algorithms operate in O(V+E) time.',
    ],
    dryRun: [
      'Grid: [[\'1\',\'1\',\'0\'],[\'0\',\'1\',\'0\'],[\'0\',\'0\',\'1\']]',
      'r=0,c=0: count=1, DFS sinks (0,0) and (0,1)',
      'r=0,c=2: \'0\', skip. r=1,c=0: \'0\', skip.',
      'r=1,c=1: \'1\', count=2, DFS sinks (1,1)',
      'r=2,c=2: \'1\', count=3, DFS sinks (2,2)',
      'End => 3 islands',
      'Word Ladder: begin=\'hit\', end=\'cog\', list=[\'hot\',\'dot\',\'dog\',\'lot\',\'log\',\'cog\']',
      'BFS: hit->hot(2)->dot(3)/lot(3)->dog(4)/log(4)->cog(5) => return 5',
    ],
    interview: [
      'DFS explores depth-first, BFS explores level-by-level.',
      'BFS guarantees shortest path in unweighted graphs.',
      'Islands problem reduces to counting connected components.',
      'Word Ladder uses BFS over implicit transformation graph.',
    ],
    practice: [lc('Number of Islands', 'medium', 'number-of-islands'), lc('Word Ladder', 'hard', 'word-ladder')],
  },
  {
    title: 'Shortest Paths', level: 12, xp: 600,
    use: 'Use Dijkstra for non-negative weights and Bellman-Ford for graphs with negative edges.',
    complexity: 'Dijkstra O((V+E) log V), Bellman-Ford O(V*E).',
    theory: 'Dijkstra\'s algorithm uses a min-heap to always expand the closest unvisited node, guaranteeing shortest paths for non-negative weights. Bellman-Ford relaxes all edges V-1 times; it can detect negative cycles and handles negative edge weights. Both compute shortest paths from a single source.',
    code: `def dijkstra(graph, start):
    import heapq
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

def bellman_ford(edges, V, start):
    dist = [float('inf')] * V
    dist[start] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None
    return dist`,
    explanation: [
      'Dijkstra pops smallest distance from min-heap.',
      'Skip stale entries where distance exceeds known.',
      'Relax neighbors with potentially shorter paths.',
      'Bellman-Ford repeats relaxation V-1 times.',
      'Extra pass detects negative cycles.',
    ],
    equation: 'Relaxation: dist[v] = min(dist[v], dist[u] + w(u,v))',
    deepNotes: [
      'Dijkstra fails with negative edge weights.',
      'Bellman-Ford handles negative edges but is O(V*E).',
      'Dijkstra uses heap for O((V+E) log V) performance.',
      'Bellman-Ford detects negative cycles via extra iteration.',
    ],
    dryRun: [
      'Graph: 0->1(4), 0->2(3), 1->2(1), 1->3(2), 2->3(5)',
      'Dijkstra start=0: dist={0:0,1:inf,2:inf,3:inf}',
      'Pop (0,0): relax 0->1 d=4, 0->2 d=3. pq=[(3,2),(4,1)]',
      'Pop (3,2): relax 2->3 d=3+5=8, dist[3]=8. pq=[(4,1),(8,3)]',
      'Pop (4,1): relax 1->2 d=5 (skip 5>3), 1->3 d=4+2=6, dist[3]=6. pq=[(6,3)]',
      'Final: {0:0, 1:4, 2:3, 3:6}',
    ],
    interview: [
      'Dijkstra greedily selects minimum distance node.',
      'Bellman-Ford systematically relaxes all edges.',
      'Negative cycles detected by Bellman-Ford post-processing.',
      'Both compute single-source shortest paths.',
    ],
    practice: [lc('Network Delay Time', 'medium', 'network-delay-time'), lc('Cheapest Flights Within K Stops', 'medium', 'cheapest-flights-within-k-stops')],
  },
  {
    title: 'Dynamic Programming', level: 13, xp: 650,
    use: 'Use when a problem has optimal substructure and overlapping subproblems.',
    complexity: 'Coin Change O(amount * coins), Knapsack O(n * capacity).',
    theory: 'Dynamic programming solves problems by breaking them into overlapping subproblems and storing results. Coin Change uses a bottom-up DP array where dp[i] = minimum coins to make amount i. 0/1 Knapsack uses a 2D DP where dp[i][w] = max value using first i items with capacity w.',
    code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]`,
    explanation: [
      'dp[i] stores min coins needed for amount i.',
      'Initialize dp[0]=0, rest infinity.',
      'Try each coin to reach amount i.',
      'Knapsack builds 2D table of items vs capacity.',
      'Each cell considers including or excluding current item.',
    ],
    equation: 'dp[i] = min(dp[i], dp[i-coin] + 1) for each coin',
    deepNotes: [
      'Coin Change is unbounded knapsack (coins reusable).',
      '2D knapsack can be optimized to 1D space.',
      'DP table size directly depends on amount/capacity.',
      'Both solve to optimality via exhaustive subproblem enumeration.',
    ],
    dryRun: [
      'coins = [1,2,5], amount = 11',
      'dp[0]=0, dp[1]=1 (coin 1), dp[2]=1 (coin 2), dp[3]=2 (1+2)',
      'dp[4]=2 (2+2), dp[5]=1 (coin 5), dp[6]=2 (5+1)',
      'dp[7]=2 (5+2), dp[8]=3 (5+2+1), dp[9]=3 (5+2+2)',
      'dp[10]=2 (5+5), dp[11]=3 (5+5+1) => return 3',
      'Knapsack: w=[1,2,3], v=[6,10,12], cap=5',
      'dp[1][1..5] for item 1 (w=1,v=6): [0,6,6,6,6,6]',
      'dp[2][1..5] for item 2 (w=2,v=10): [0,6,10,16,16,16]',
      'dp[3][1..5] for item 3 (w=3,v=12): [0,6,10,16,18,22] => 22',
    ],
    interview: [
      'DP trades space for time on overlapping subproblems.',
      'Optimal substructure: solution contains sub-solutions.',
      'Bottom-up builds from smallest subproblem upward.',
      'Top-down with memoization is equivalent alternative.',
    ],
    practice: [lc('Coin Change', 'medium', 'coin-change'), lc('Longest Common Subsequence', 'medium', 'longest-common-subsequence')],
  },
  {
    title: 'Backtracking', level: 14, xp: 700,
    use: 'Use when exploring all configurations with pruning on invalid states.',
    complexity: 'Subsets O(n * 2^n), N-Queens O(n!).',
    theory: 'Backtracking incrementally builds candidates and abandons them when they cannot lead to a valid solution. For Subsets, at each element decide to include or exclude it, recursing forward. For N-Queens, place queens row by row, checking column and diagonal conflicts, backtracking when no valid column exists.',
    code: `def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res

def solve_n_queens(n):
    cols = set()
    pos_diag = set()
    neg_diag = set()
    board = [['.'] * n for _ in range(n)]
    res = []
    def backtrack(r):
        if r == n:
            res.append([''.join(row) for row in board])
            return
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            cols.add(c)
            pos_diag.add(r + c)
            neg_diag.add(r - c)
            board[r][c] = 'Q'
            backtrack(r + 1)
            board[r][c] = '.'
            neg_diag.remove(r - c)
            pos_diag.remove(r + c)
            cols.remove(c)
    backtrack(0)
    return res`,
    explanation: [
      'Subsets: for each index, include or skip element.',
      'Append copy of path at every recursion level.',
      'N-Queens places queen, marks column and diagonals.',
      'Prune when queen conflicts with existing placement.',
      'Backtrack by removing queen and unmarking sets.',
    ],
    equation: 'Subsets count = 2^n. N-Queens = number of valid board arrangements.',
    deepNotes: [
      'Backtracking performs DFS over state space tree.',
      'N-Queens pruning uses set O(1) conflict checks.',
      'All subsets recurse n levels deep.',
      'Both produce all valid solutions exhaustively.',
    ],
    dryRun: [
      'nums = [1,2,3], start=0, path=[]',
      'append [], i=0: path=[1], recurse',
      'append [1], i=1: path=[1,2], recurse',
      'append [1,2], i=2: path=[1,2,3], recurse => append [1,2,3]',
      'pop -> [1,2], pop -> [1]',
      'i=1: path=[1,3], recurse => append [1,3]',
      'Continue for [2], [2,3], [3] => 8 subsets total',
      'N=4: backtrack(0), place Q at (0,1), cols={1}, pos={1}, neg={-1}',
      'r=1: try c=0 (ok), place (1,0)',
      'r=2: try c=0 fail, c=1 fail, c=2 fail, c=3 ok',
      'r=3: try c=0 fail, c=1 fail, c=2 fail, c=3 fail => backtrack',
    ],
    interview: [
      'Backtracking systematically explores all candidates.',
      'Pruning is essential for reasonable performance.',
      'N-Queens uses O(n) space for conflict sets.',
      'State space size determines time complexity.',
    ],
    practice: [lc('Subsets', 'medium', 'subsets'), lc('N-Queens', 'hard', 'n-queens')],
  },
  {
    title: 'Advanced DP', level: 15, xp: 750,
    use: 'Use for tree DP where state depends on children (post-order).',
    complexity: 'Time O(n), space O(h) where h is tree height.',
    theory: 'Tree DP processes nodes in post-order (children before parent). For Binary Tree Maximum Path Sum, each node returns the max gain of a path starting at that node and extending downward. The global maximum considers paths that go through the node combining left and right gains. For House Robber III, each node returns two values: max gain when robbed and when not robbed.',
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root):
    max_sum = float('-inf')
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)
        max_sum = max(max_sum, left + right + node.val)
        return node.val + max(left, right)
    dfs(root)
    return max_sum

def rob_iii(root):
    def dfs(node):
        if not node:
            return (0, 0)
        left = dfs(node.left)
        right = dfs(node.right)
        rob = node.val + left[1] + right[1]
        not_rob = max(left) + max(right)
        return (rob, not_rob)
    return max(dfs(root))`,
    explanation: [
      'DFS returns max gain path from node downward.',
      'Clamp negative gains to 0 for max path sum.',
      'Update global max as left+right+node.val.',
      'Tree DP returns pair (rob, not_rob) for each node.',
      'Root result is max of its two states.',
    ],
    equation: 'For each node: max_path = max(left_gain, 0) + max(right_gain, 0) + node.val',
    deepNotes: [
      'Post-order traversal ensures children processed first.',
      'Path sum can start and end at any nodes.',
      'Tree DP encodes state as a tuple of values.',
      'Both solutions use O(h) recursion stack space.',
    ],
    dryRun: [
      'Tree: [-10,9,20,null,null,15,7]',
      'leaf 9: left=0, right=0, max_sum=9, return 9',
      'leaf 15: left=0, right=0, max_sum=15, return 15',
      'leaf 7: left=0, right=0, max_sum=15, return 7',
      'node 20: left=15, right=7, max_sum=max(15,15+7+20=42)=42, return 20+15=35',
      'root -10: left=9, right=35, max_sum=max(42,9+35-10=34)=42 => return 42',
      'Rob III: leaf node returns (val, 0)',
      'node: rob = val + left.not_rob + right.not_rob',
      'not_rob = max(left) + max(right)',
    ],
    interview: [
      'Tree DP uses post-order for child-dependent states.',
      'Maximum path sum handles negative gains by clamping to 0.',
      'House Robber III uses pair DP per node.',
      'Recursion implicitly uses tree depth as stack.',
    ],
    practice: [lc('Binary Tree Maximum Path Sum', 'hard', 'binary-tree-maximum-path-sum'), lc('House Robber III', 'medium', 'house-robber-iii')],
  }
]
