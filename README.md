# SL_Engine

###
###	Project Goals/ Motivation
###
This is a project for studying and utilizing propositional logic; from truth trees and translations to *hopefully* complete derivations. The SL_Engine is currently capable of lexicographical analysis of symbolic tokens that constitute valid formulae in propositional caluculus. 

Valid Tokens for the SL_Engine include:

Truth_Functional Operators: ['~', '^', 'v', '=>', '<=>']
Propositional Terms: ['A'-'Z']
Precedence Tokens: ['(', ')']

The engine works by taking in an input file constituted by valid formulae in propositional logic. Formulae are transformed into their postfix representations, according to an operator precedence, ['(', '~', '^', 'v', '=>', '<=>'], with the left parentheses '(' having the highest precedence. Formulae are then read into abstract syntax trees with their main logical operator as their root.

With formulae represented as abstract syntax trees, we can perform operations and analyses on logical formulae by modifying the structure or content of the tree.

###
###	Building
###
Source files are located in src/; Test files are located in tests/. Run the main script from its correct place in the file structure, that of the highest level, to run the Engine.
