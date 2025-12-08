// define a function that prefixes console.log messages
// with a timestamp in [HH:MM:SS.NNN] format
function logmsg(...args) {
  const now = new Date();
  // Format local time as [HH:MM:SS.mmm]
  const pad = (n, z = 2) => n.toString().padStart(z, '0');
  const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
  const prefix=`${timestamp}:`;
  if (args.length > 0) {
    if (typeof args[0] === 'string') {
      args[0] = `${prefix} ${args[0]}`;
    } else {
      args.unshift(prefix);
    }
  } else {
    args = [`${prefix}`];
  }
  console.log(...args);
}
