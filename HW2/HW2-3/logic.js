// // let matrix = [
//     [1, 4, 5],
//     [4, 3, 0],
//     [2, 8, 4]
// ];
// console.log(matrix);
// var n = matrix.length;
// for (var i = 0; i < n / 2; i++) {
//     for (var j = i; j < n - i - 1; j++) {
//         var tmp = matrix[i][j];
//         matrix[i][j] = matrix[j][n - i - 1];
//         matrix[j][n - i - 1] = matrix[n - i - 1][n - j - 1];
//         matrix[n - i - 1][n - j - 1] = matrix[n - j - 1][i];
//         matrix[n - j - 1][i] = tmp;
//     }
// }
// //
// // rotate(matrix);
// console.log(matrix);
// //
// // const flipMatrix = matrix => (
// //     matrix[0].map((column, index) => (
// //         matrix.map(row => row[index])
// //     ))
// // );
// //
// // const rotateMatrixCounterClockwise = matrix => (
// //     flipMatrix(matrix).reverse()
// // );
// // matrix = rotateMatrixCounterClockwise(matrix);
// //
// // // rotateMatrixCounterClockwise(matrix);
// // console.log(matrix);
// // // console.log(rotateMatrixCounterClockwise(matrix));