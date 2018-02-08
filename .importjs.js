module.exports = {
  excludes: [
    'react-components/**/test/**'
  ],

  importStatementFormatter({importStatement}) {
    return importStatement.replace(/\{\s(.*)\s\}/, '{$1}');
  }
}
