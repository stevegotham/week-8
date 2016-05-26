// Write a function secondGreatLow that takes a single array of numbers and returns the second lowest and second greatest numbers, respectively, separated by a space. For example: if the array contains [7, 7, 12, 98, 106] the output should be "12 98". The array will not be empty and will contain at least 2 numbers. It can get tricky if there's just two numbers!

function secondGreatLow(array){
  if(array.length === 2) return array[0] + " " + array[1];
  else {
    array.sort(function(a, b) {
      return a-b;
    });
    var secondLow;
    var secondHigh;
    var low = array[0];
    var high = array[array.length-1];
    var i=0;
    var x=array.length-1;
    while(array[i] === low) {
      i++;
      secondLow = array[i]
    }
    while(array[x] === high) {
      x--;
      secondHigh = array[x]
    }
    return secondLow + ' ' + secondHigh;
  }
}

secondGreatLow([1,2]);
secondGreatLow([7,106,12,98,7]);

// Write a function timeConvert that takes a number parameter and returns the number of hours and minutes the parameter converts to (ie. if num = 63 then the output should be 1:3). Separate the number of hours and minutes with a colon.

function timeConvert(number) {
  var hours = Math.floor(number/60)
  var minutes = number%60;
  return hours + ':' + minutes;
}

timeConvert(63);

// Write a function bracketMatcher that takes a single string parameter and returns true if the brackets are correctly matched and each one is accounted for. Otherwise return false. For example: if str is "(hello (world))", then the output should be true, but if str is "((hello (world))" the the output should be false because the brackets do not correctly match up. "(()())" should return true. Only "(" and ")" will be used as brackets. If str contains no brackets return true.

function bracketMatcher(string) {
  var brackets = 0;
  for(var i=0;i<string.length;i++){
    if(string[i] === '(') {
      brackets += 1;
    }
    if(string[i] === ')') {
      brackets -= 1;
    }
  }
  if (brackets === 0) {
    return true
  }
  return false
}

bracketMatcher("((hello (world))")
