const TokenType = Object.freeze({
  //Literales
  INT_LITERAL: 'INT_LITERAL',
  FLOAT_LITERAL: 'FLOAT_LITERAL',
  STRING_LITERAL: 'STRING_LITERAL',

  //identificadores
  IDENTIFIER: 'IDENTIFIER',

  //Palabras reservadas: tipos
  INT:   'INT',
  FLOAT:   'FLOAT',
  STRING: 'STRING',
  BOOL:   'BOOL',
  SERVER:  'SERVER',
  SERVICE:  'SERVICE',
  DATABASE: 'DATABASE',

  //Palabras reservadas: control
  IF:       'IF',
  ELSE:     'ELSE',
  WHILE:    'WHILE',
  FOR:      'FOR',
  BREAK:    'BREAK',
  CONTINUE: 'CONTINUE',
  RETURN:   'RETURN',

  //Palabras reservadas: declaraciones
  FUNCTION: 'FUNCTION',
  TASK:   'TASK',
  MAIN:   'MAIN',
  RUN:   'RUN',

  //Palabras reservadas: literales
  TRUE: 'TRUE',
  FALSE: 'FALSE',

  //Operadores
  PLUS:       'PLUS',           // +
  MINUS:     'MINUS',          // -
  STAR:      'STAR',           // *
  SLASH:    'SLASH',          // /
  PERCENT:    'PERCENT',        // %
  ASSIGN:       'ASSIGN',         // =
  EQUAL_EQUAL:  'EQUAL_EQUAL',    // ==
  NOT_EQUAL:   'NOT_EQUAL',      // !=
  LESS:      'LESS',           // <
  LESS_EQUAL: 'LESS_EQUAL',     // <=
  GREATER:   'GREATER',        // >
  GREATER_EQUAL: 'GREATER_EQUAL',  // >=
  AND:      'AND',            // &&
  OR:       'OR',             // ||
  NOT:      'NOT',            // !

  //delimitadores
  LBRACE:  'LBRACE',  // {
  RBRACE:  'RBRACE', // }
  LPAREN: 'LPAREN',  // (
  RPAREN:  'RPAREN',   // )
  LBRACKET: 'LBRACKET', // [
  RBRACKET: 'RBRACKET', // ]
  SEMICOLON:'SEMICOLON',// ;
  COMMA: 'COMMA',  // ,
  DOT:  'DOT',    // .

  EOF: 'EOF',
});
module.exports = TokenType;