/*
  # Seed Built-in DSA Sheets

  1. New Data
    - Insert Blind 75, Striver Sheet, and Love Babbar Sheet problems
    - Create public sheets for each collection
    - Link problems to their respective sheets

  2. Security
    - All sheets are public and accessible to authenticated users
    - Problems are shared across all users
*/

-- Insert the three built-in sheets
INSERT INTO sheets (name, type) VALUES
  ('Blind 75', 'public'),
  ('Striver Sheet', 'public'),
  ('Love Babbar Sheet', 'public');

-- Insert Blind 75 problems
INSERT INTO problems (name, topic, level, platform, link) VALUES
  ('Two Sum', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/two-sum/'),
  ('Best Time to Buy and Sell Stock', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'),
  ('Contains Duplicate', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/contains-duplicate/'),
  ('Product of Array Except Self', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/product-of-array-except-self/'),
  ('Maximum Subarray', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/'),
  ('Maximum Product Subarray', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/maximum-product-subarray/'),
  ('Find Minimum in Rotated Sorted Array', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'),
  ('Search in Rotated Sorted Array', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/search-in-rotated-sorted-array/'),
  ('3Sum', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/3sum/'),
  ('Container With Most Water', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/container-with-most-water/'),
  ('Valid Parentheses', 'String', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-parentheses/'),
  ('Valid Anagram', 'String', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-anagram/'),
  ('Valid Palindrome', 'String', 'Easy', 'LeetCode', 'https://leetcode.com/problems/valid-palindrome/'),
  ('Longest Substring Without Repeating Characters', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'),
  ('Longest Repeating Character Replacement', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-repeating-character-replacement/'),
  ('Minimum Window Substring', 'String', 'Hard', 'LeetCode', 'https://leetcode.com/problems/minimum-window-substring/'),
  ('Group Anagrams', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/group-anagrams/'),
  ('Longest Palindromic Substring', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/longest-palindromic-substring/'),
  ('Palindromic Substrings', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/palindromic-substrings/'),
  ('Encode and Decode Strings', 'String', 'Medium', 'LeetCode', 'https://leetcode.com/problems/encode-and-decode-strings/');

-- Insert Striver Sheet problems
INSERT INTO problems (name, topic, level, platform, link) VALUES
  ('Set Matrix Zeroes', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/set-matrix-zeroes/'),
  ('Pascal''s Triangle', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/pascals-triangle/'),
  ('Next Permutation', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/next-permutation/'),
  ('Kadane''s Algorithm', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/maximum-subarray/'),
  ('Sort Colors', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/sort-colors/'),
  ('Stock Buy Sell', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'),
  ('Rotate Matrix', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/rotate-image/'),
  ('Merge Intervals', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/merge-intervals/'),
  ('Merge Sorted Array', 'Array', 'Easy', 'LeetCode', 'https://leetcode.com/problems/merge-sorted-array/'),
  ('Find Duplicate Number', 'Array', 'Medium', 'LeetCode', 'https://leetcode.com/problems/find-the-duplicate-number/'),
  ('Reverse Linked List', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/reverse-linked-list/'),
  ('Middle of Linked List', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/middle-of-the-linked-list/'),
  ('Merge Two Sorted Lists', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/merge-two-sorted-lists/'),
  ('Remove Nth Node From End', 'Linked List', 'Medium', 'LeetCode', 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'),
  ('Add Two Numbers', 'Linked List', 'Medium', 'LeetCode', 'https://leetcode.com/problems/add-two-numbers/'),
  ('Delete Node in Linked List', 'Linked List', 'Medium', 'LeetCode', 'https://leetcode.com/problems/delete-node-in-a-linked-list/'),
  ('Intersection of Two Linked Lists', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/intersection-of-two-linked-lists/'),
  ('Linked List Cycle', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/linked-list-cycle/'),
  ('Linked List Cycle II', 'Linked List', 'Medium', 'LeetCode', 'https://leetcode.com/problems/linked-list-cycle-ii/'),
  ('Palindrome Linked List', 'Linked List', 'Easy', 'LeetCode', 'https://leetcode.com/problems/palindrome-linked-list/');

-- Insert Love Babbar Sheet problems
INSERT INTO problems (name, topic, level, platform, link) VALUES
  ('Reverse Array', 'Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/reverse-an-array/0'),
  ('Maximum and Minimum', 'Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array/1'),
  ('Kth Smallest Element', 'Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kth-smallest-element/0'),
  ('Sort 0s 1s 2s', 'Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s/1'),
  ('Move Negative Numbers', 'Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/move-all-negative-numbers-to-beginning-and-positive-to-end-with-constant-extra-space/1'),
  ('Union of Arrays', 'Array', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/union-of-two-arrays/0'),
  ('Cyclically Rotate Array', 'Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one/1'),
  ('Kadane''s Algorithm (GFG)', 'Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/kadanes-algorithm/0'),
  ('Merge Intervals (GFG)', 'Array', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/overlapping-intervals/1'),
  ('Merge Without Extra Space', 'Array', 'Hard', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1'),
  ('Reverse String', 'String', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/reverse-a-string/1'),
  ('Check Palindrome', 'String', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/palindrome-string0817/1'),
  ('Duplicate Characters', 'String', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-first-repeated-character4108/1'),
  ('Check Rotation', 'String', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/check-if-string-is-rotated-by-two-places/1'),
  ('Valid Shuffle', 'String', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/check-if-a-string-is-a-valid-shuffle-of-two-strings/1'),
  ('Count and Say', 'String', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/decode-the-pattern1138/1'),
  ('Longest Palindrome (GFG)', 'String', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/longest-palindrome-in-a-string/0'),
  ('Longest Common Prefix', 'String', 'Easy', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/longest-common-prefix-in-an-array/0'),
  ('Number of Islands', 'String', 'Medium', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/find-the-number-of-islands/1'),
  ('Edit Distance', 'String', 'Hard', 'GeeksforGeeks', 'https://practice.geeksforgeeks.org/problems/edit-distance3702/1');

-- Link problems to sheets
-- Blind 75 sheet
INSERT INTO sheet_problems (sheet_id, problem_id)
SELECT s.id, p.id
FROM sheets s, problems p
WHERE s.name = 'Blind 75' AND p.name IN (
  'Two Sum', 'Best Time to Buy and Sell Stock', 'Contains Duplicate',
  'Product of Array Except Self', 'Maximum Subarray', 'Maximum Product Subarray',
  'Find Minimum in Rotated Sorted Array', 'Search in Rotated Sorted Array',
  '3Sum', 'Container With Most Water', 'Valid Parentheses', 'Valid Anagram',
  'Valid Palindrome', 'Longest Substring Without Repeating Characters',
  'Longest Repeating Character Replacement', 'Minimum Window Substring',
  'Group Anagrams', 'Longest Palindromic Substring', 'Palindromic Substrings',
  'Encode and Decode Strings'
);

-- Striver Sheet
INSERT INTO sheet_problems (sheet_id, problem_id)
SELECT s.id, p.id
FROM sheets s, problems p
WHERE s.name = 'Striver Sheet' AND p.name IN (
  'Set Matrix Zeroes', 'Pascal''s Triangle', 'Next Permutation',
  'Kadane''s Algorithm', 'Sort Colors', 'Stock Buy Sell',
  'Rotate Matrix', 'Merge Intervals', 'Merge Sorted Array',
  'Find Duplicate Number', 'Reverse Linked List', 'Middle of Linked List',
  'Merge Two Sorted Lists', 'Remove Nth Node From End', 'Add Two Numbers',
  'Delete Node in Linked List', 'Intersection of Two Linked Lists',
  'Linked List Cycle', 'Linked List Cycle II', 'Palindrome Linked List'
);

-- Love Babbar Sheet
INSERT INTO sheet_problems (sheet_id, problem_id)
SELECT s.id, p.id
FROM sheets s, problems p
WHERE s.name = 'Love Babbar Sheet' AND p.name IN (
  'Reverse Array', 'Maximum and Minimum', 'Kth Smallest Element',
  'Sort 0s 1s 2s', 'Move Negative Numbers', 'Union of Arrays',
  'Cyclically Rotate Array', 'Kadane''s Algorithm (GFG)', 'Merge Intervals (GFG)',
  'Merge Without Extra Space', 'Reverse String', 'Check Palindrome',
  'Duplicate Characters', 'Check Rotation', 'Valid Shuffle',
  'Count and Say', 'Longest Palindrome (GFG)', 'Longest Common Prefix',
  'Number of Islands', 'Edit Distance'
);