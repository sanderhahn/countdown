// inspiration:
// http://www.cs.nott.ac.uk/~gmh/bib.html#countdown

var numbers = [1, 3, 7, 10, 25, 50];
var operators = ['+', '-', '*', '/'];
var value = 765;

console.log("Stap 1: bedenk een datastructuur voor expressies\n")

console.log('Een expressie is of:')
console.log('- een nummer')
console.log("- een hash table met {op: <operator>, x: <expressie links>, y: <expressie rechts>}\n")

console.log('We maken de functies die werken op een expressie:')
console.log('- print (zet de expressie om naar een string)')
console.log("- eval (evalueert de expressie naar zijn waarde)\n")

console.log("De functies zijn recursief op de structuur van de expressie:")
console.log("- een nummer is het nummer zelf (de stopconditie)")
console.log("- een hash is een nieuwe expressie en we kunnen de functie recursief aanroepen op de x en y\n")

var examples = [
  1,
  {op: "+", x: 1, y: 2},
  {op: "+", x: {op: "+", x: 1, y: 2}, y: 3},
  {op: "+", x: 1, y: {op: "+", x: 2, y: 3}}
]

for(var i in examples) {
  var example = examples[i];
  console.log('Voorbeeld:');
  console.log('  print(', example, ') = ', print(example))
  console.log('  eval(', example, ') = ', eval(example))
  console.log()
}

console.log('De opdracht zegt dat er bepaalde voorwaarden zijn waar subexpressies aan moeten voldoen.')
console.log('Dit is in de valid functie uitgewerk...')
console.log('- subexpressies moeten groter zijn dan 0')
console.log('- subexpressies moeten een geheel getal worden')
console.log()

console.log('Stap 2: genereer alle mogelijke permutaties van getallen')
console.log(permutate([1,2,3]))
console.log()

console.log('De permutatie functie is ook recursief:')
console.log('- een permutatie van een lege lijst is een lege lijst (de stopconditie)')
console.log('- een permutatie van een lijst met getallen')
console.log('  - kies voor iedere index het getal (begin getal)')
console.log('  - gebruik de overige getallen om een nieuwe permutaties te bouwen')
console.log('  - combineer het begin getal en de rest permutaties')
console.log()

console.log('Stap 3: verwijder dubbele permutaties door te sorteren en te filteren op unieke')
console.log(permutate([1,2,2]))
console.log()
console.log('Alleen de unieke:')
console.log(array_unique(permutate([1,2,2])))
console.log()

console.log('Stap 4: genereer alle mogelijke expressies van een lijst met getallen')
console.log(build_expressions([1,2,3]))
console.log()

console.log('Build expressions is ook recursief:')
console.log('- een expressie bouwen met 1 getal is het getal zelf (de stopconditie)')
console.log('- een expressie bouwen met meer getallen')
console.log('  - splits de lijst in een linker en een rechter stuk op de index van (1 t/m laatste -1)')
console.log('  - bouw expressies van de linker en de rechter onderdelen')
console.log('  - combineer de linker en de rechter expressies met alle mogelijke operators')
console.log()

console.log('Stap 5: combineer de basis functies om het algorithme uit te voeren:')
console.log('1. genereer alle mogelijke permutaties')
console.log('2. genereer hiervan alle mogelijke expressies')
console.log('3. filter alle expressies die evalueren naar de juiste waarde')
console.log('4. geef de oplossing door print aan te roepen op iedere oplossing')
console.log()

// expr = {op: .., x: .., y: ..}

function valid(expr) {
  if(typeof expr == 'number' && expr > 0) {
    return true;
  } else {
    switch(expr.op) {
    case '+':
      return true;
    case '-':
      return eval(expr.x) > eval(expr.y);
    case '*':
      return true;
    case '/':
      return (eval(expr.x) % eval(expr.y)) == 0;
    }
  }
}

function eval(expr) {
  if(typeof expr == 'number' && expr > 0) {
    return expr;
  } else {
    var x = eval(expr.x)
    var y = eval(expr.y)
    switch(expr.op) {
    case '+':
      return x + y;
    case '-':
      return x - y;
    case '*':
      return x * y;
    case '/':
      return x / y;
    }
  }
}

function print(expr) {
  if(typeof expr == 'number' && expr > 0) {
    return String(expr);
  } else {
    return ['(', print(expr.x), ' ', expr.op, ' ', print(expr.y), ')'].join('');
  }
}

function permutate(numbers) {
  var results = [];
  for(var i in numbers) {
    // copy the list
    var rest = numbers.slice(0);
    // remove item at index
    var number = rest.splice(i, 1)[0];
    results.push([number]);

    var permutate_rest = permutate(rest);
    for(var j in permutate_rest) {
      results.push([number].concat(permutate_rest[j]));
    }
  }
  return results;
}

function array_compare(a, b) {
  var max = Math.min(a.length, b.length)
  for(var i = 0; i < max; i++) {
    if(a[i] != b[i]) {
      return a[i] - b[i];
    }
  }
  return a.length - b.length;
}

function array_unique(list) {
  list = list.sort(array_compare);
  var uniques = [];
  for(var i in list) {
    if(i == 0 || array_compare(list[i], list[i - 1]) != 0) {
      uniques.push(list[i]);
    }
  }
  return uniques;
}

function build_expressions(numbers) {
  var expressions = [];
  if(numbers.length == 1) {
    expressions.push(numbers[0]);
  } else {
    for(var i = 1; i <= numbers.length-1; i++) {
      var left = numbers.slice(0, i)
      var right = numbers.slice(i)

      var left_expressions = build_expressions(left);
      var right_expressions = build_expressions(right);

      for(var l in left_expressions) {
        var left = left_expressions[l];

        for(var r in right_expressions) {
          var right = right_expressions[r];

          for(var o in operators) {
            var op = operators[o];
            var expr = {op: op, x: left, y: right};
            if(valid(expr)) {
              expressions.push(expr);
            }
          }
        }
      }
    }
  }
  return expressions;
}

function countdown(numbers, value) {
  var unique_permutations = array_unique(permutate(numbers));
  var expressions = [];
  for(var i in unique_permutations) {
    var permutation = unique_permutations[i];
    var permutation_expressions = build_expressions(permutation);
    var solutions = permutation_expressions.filter(function(expr) {
      return eval(expr) == value;
    })
    expressions = expressions.concat(solutions);
  }
  return expressions;
}

//console.log(permutate([1, 2, 3]))
//console.log(array_compare([2, 1], [2, 3]))
//console.log(array_unique(permutate([1, 2, 2])))
//console.log(build_expressions([2, 1, 3, 4]).map(print))
//var solutions = countdown([1, 2, 3, 4], 26)

console.log("De countdown van numbers", numbers, "met operators", operators, "naar waarde", value, "is:")
var solutions = countdown(numbers, value)
console.log("number of solutions:", solutions.length)
console.log(solutions.map(print).sort().join("\n"))

