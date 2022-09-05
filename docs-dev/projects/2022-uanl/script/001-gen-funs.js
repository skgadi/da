const leastCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);

const greatestCommonDivisor = (a, b) => {
  const remainder = a % b;
  if (remainder === 0) return b;
  return greatestCommonDivisor(b, remainder);
};


function syncSleepFor(sleepDuration){
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ 
      /* Do nothing */ 
  }
}