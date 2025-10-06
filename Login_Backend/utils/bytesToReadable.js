const bytesToReadable = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${val} ${sizes[i]}`;
};

const sizeBucket = (bytes) => {
  if (bytes < 1 * 1024 * 1024) return 'Small (<1MB)';
  if (bytes <= 3 * 1024 * 1024) return 'Medium (1-3MB)';
  return 'Large (>3MB)';
};

// ✅ Correct Export
module.exports = { bytesToReadable, sizeBucket };







// const bytesToReadable = (bytes) => {
//   if (bytes === 0) return '0 B';
//   const k = 1024;
//   const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
//   return `${val} ${sizes[i]}`;
// }

// const sizeBucket = (bytes) => {
//   if (bytes < 1 * 1024 * 1024) return 'Small (<1MB)';
//   if (bytes <= 3 * 1024 * 1024) return 'Medium (1-3MB)';
//   return 'Large (>3MB)';
// }


// module.exports = bytesToReadable, sizeBucket ;