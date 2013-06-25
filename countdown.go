package main

import (
	//"testing"
	"fmt"
	"strconv"
	"strings"
)

type Expr interface {
	Eval() int
	String() string
	Valid() bool
}

type OperatorType string

const (
	opAdd      OperatorType = "+"
	opSubtract              = "-"
	opMultiply              = "*"
	opDivide                = "/"
)

type Number struct {
	value int
}

func (n Number) Eval() int {
	return n.value
}

func (n Number) Valid() bool {
	return n.value > 0
}

func (n Number) String() string {
	return strconv.Itoa(n.value)
}

type Operator struct {
	op          OperatorType
	left, right Expr
}

func (o Operator) Eval() int {
	var left = o.left.Eval()
	var right = o.right.Eval()
	switch o.op {
	case opAdd:
		return left + right
	case opSubtract:
		return left - right
	case opMultiply:
		return left * right
	case opDivide:
		return left / right
	}
	return -1
}

func (o Operator) Valid() bool {
	switch o.op {
	case opAdd:
		return true
	case opSubtract:
		return o.left.Eval() > o.right.Eval()
	case opMultiply:
		return true
	case opDivide:
		return o.left.Eval()%o.right.Eval() == 0
	}
	return false
}

func (o Operator) String() string {
	var left = o.left.String()
	var right = o.right.String()
	return strings.Join([]string{"(", left, " ", string(o.op), " ", right, ")"}, "")
}

// http://en.wikipedia.org/wiki/Permutation#Generation_in_lexicographic_order

func nextPermutation(a []int) (more bool) {
	var k, l int
	n := len(a) - 1
	for k = n - 1; k >= 0; k-- {
		if a[k] < a[k+1] {
			break
		}
	}
	if k == -1 {
		return false
	}
	for l = n; l > 0; l-- {
		if a[k] < a[l] {
			break
		}
	}
	//fmt.Printf("found k = %v a[k] = %v\n", k, a[k])
	//fmt.Printf("found l = %v a[l] = %v\n", l, a[l])
	a[k], a[l] = a[l], a[k]

	for r, i := k+1, n; r < i; r, i = r+1, i-1 {
		//fmt.Printf("r = %v i = %v\n", r, i)
		a[r], a[i] = a[i], a[r]
	}
	return true
}

var operators = [...]OperatorType{opAdd, opSubtract, opMultiply, opDivide}

func BuildExpressions(numbers []int) []Expr {
	expressions := make([]Expr, 0)
	if len(numbers) == 1 {
		expressions = append(expressions, Expr(Number{numbers[0]}))
	} else {
		for i := 1; i < len(numbers); i++ {
			for _, left := range BuildExpressions(numbers[:i]) {
				for _, right := range BuildExpressions(numbers[i:]) {
					for _, oper := range operators {
						var expr = Expr(Operator{oper, left, right})
						if expr.Valid() {
							expressions = append(expressions, expr)
						}
					}
				}
			}
		}
	}
	return expressions
}

func PowerSet(numbers []int) [][]int {
	result := make([][]int, 0)
	for i, v := range numbers {
		one := []int{v}
		result = append(result, one)
		//fmt.Printf("numbers %v\n", numbers)
		//fmt.Printf("one %v\n", one)
		rest := make([]int, len(numbers)-1)
		copy(rest[0:], numbers[:i])
		copy(rest[i:], numbers[i+1:])
		//fmt.Printf("rest %v\n", rest)
		for _, powerrest := range PowerSet(rest) {
			result = append(result, append(one, powerrest...))
		}
	}
	return result
}

func main() {
	numbers := []int{1, 3, 7, 10, 25, 50}
	test := 765
	powerset := PowerSet(numbers)
	solutions := 0
	exprs := 0
	for _, set := range powerset {
		expressions := BuildExpressions(set)
		for _, expression := range expressions {
			if expression.Eval() == test {
        fmt.Printf("%v\n", expression.String())
				solutions++
			}
      exprs++
		}
	}
	fmt.Printf("number of solutions: %v\n", solutions)
	fmt.Printf("number of expressions: %v\n", exprs)
}
