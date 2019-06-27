//IP置换矩阵
let IP_Table =[
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
]

//扩展矩阵
let E_Table =
  [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
  ]
//  P 盒
let P_Table =
  [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25
  ]
//逆IP置换矩阵
let IPR_Table =
  [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
  ]
//密钥第一次置换矩阵
let PC1_Table =
  [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
  ]
// 密钥第二次置换矩阵
let PC2_Table =
  [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
  ]
//8个S盒   三维数组
let S_Box =
  [
				//S1
				[
  [ 14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7 ],
  [ 0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8 ],
  [ 4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0 ],
  [ 15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13 ]
],

// S2
[
  [ 15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10 ],
  [ 3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5 ],
  [ 0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15 ],
  [ 13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9 ]
],

//S3
[
  [ 10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8 ],
  [ 13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1 ],
  [ 13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7 ],
  [ 1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12 ]
],

// S4
[
  [ 7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15 ],
  [ 13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9 ],
  [ 10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4 ],
  [ 3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14 ]
],

//S5
[
  [ 2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9 ],
  [ 14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6 ],
  [ 4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14 ],
  [ 11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3 ]
],

//S6
[
  [ 12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11 ],
  [ 10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8 ],
  [ 9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6 ],
  [ 4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13 ]
],

// S7
[
  [ 4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1 ],
  [ 13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6 ],
  [ 1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2 ],
  [ 6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12 ]
],

//S8
[
  [ 13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7 ],
  [ 1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2 ],
  [ 7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8 ],
  [ 2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11 ]
]
		];



const CharToBit = (input) => {//把CHAR转换为unsigned char
  let i, j
  let output = []
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 8; i++) {
      output[7 * (j + 1) - i + j] = (input[j] >> i) & 1;
    }
  }
  return output
}

const BitToChar = (intput) => //把unsigned char转换为CHAR
{
  let i, j;
  let output = new Array(8).fill(0);
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 8; i++) {
      output[j] = output[j] * 2 + intput[i + 8 * j];
    }
  }
  return output
}

const Xor = (INA, INB, len) => //异或操作
{
  let i;
  for (i = 0; i < len; i++) {
		INA[i] = INA[i] ^ INB[i];
  }
  return INA
}

const IP = (input, table) => //初始IP置换
{
  let i
  let output = []
  for (i = 0; i < 64; i++) {
    output[i] = input[table[i] - 1];//减1操作不可少！！
  }
  return output
}

const E = (input, output, table) => //E扩展
{
  let i;
  for (i = 0; i < 48; i++) {
    output[i] = input[table[i] - 1];
  }
  return output
}

const P = (input, output, table) => //P置换
{
  let i;
  for (i = 0; i < 32; i++) {
    output[i] = input[table[i] - 1];
  }
  return output
}

const IP_In = (input, output, table) => //逆IP
{
  let i;
  for (i = 0; i < 64; i++) {
    output[i] = input[table[i] - 1];
  }
  return output
}

const PC_1 = (input, table) => //PC_1
{
  let i;
  let output = [];
  for (i = 0; i < 56; i++) {
    output[i] = input[table[i] - 1];
  }
  return output
}

const PC_2 = (input, table) => //PC_2
{
  let i;
  let output = []
  for (i = 0; i < 48; i++) {
    output[i] = input[table[i] - 1];
  }
  return output
}

const S = (input, output, table) => //S盒压缩
{
  let i = 0;
  let j = 0;
  let Buff = [];
  for (; i < 48; i = i + 6) {
    Buff[j] = table[j][(input[i] << 1) + (input[i + 5])][(input[i + 1] << 3) + (input[i + 2] << 2) + (input[i + 3] << 1) + (input[i + 4])];
    j++;
  }
  for (j = 0; j < 8; j++) {
    for (i = 0; i < 4; i++) {
      output[3 * (j + 1) - i + j] = (Buff[j] >> i) & 1;
    }
  }
  return output
}

const F_func = (input, subkey) => //完成DES算法轮变换
{
  let len = 48;
  let temp = [];
  let temp_1 = [];
  let output = []
  temp = E(input, temp, E_Table);
  temp = Xor(temp, subkey, len);
  temp_1 = S(temp, temp_1, S_Box);
  output = P(temp_1, output, P_Table);
  return output
}

const RotateL = (input, leftCount) => //秘钥循环左移
{
  let i
  let output = []
  let len = 28;
  for (i = 0; i < len; i++) {
    output[i] = input[(i + leftCount) % len];
  }
  return output
}

const createArr = (first, second) => {
  var myarr = new Array(); //先声明一维 
  for (var i = 0; i < first; i++) { //一维长度为first
    myarr[i] = new Array(); //再声明二维 
    for (var j = 0; j < second; j++) { //二维长度为second
      myarr[i][j] = 0; // 赋值，每个数组元素的值为0
    }
  }
  return myarr
}

const subKey_fun = (input, Subkey) => //子密钥生成
{
  let loop = 1
  let loop_2 = 2
  let i, j;
  let c = [], d = [];
  let pc_1 = [];
  let pc_2 = createArr(16, 56)
  let rotatel_c = createArr(16, 28)
  let rotatel_d = createArr(16, 28)
  let leftCount = 0;

  pc_1 = PC_1(input, PC1_Table);
  for (i = 0; i < 28; i++) {
    c[i] = pc_1[i];
    d[i] = pc_1[i + 28];
  }

  for (i = 1; i < 17; i++) {
    if (i == 1 || i == 2 || i == 9 || i == 16) {
      leftCount += loop;
      rotatel_c[i - 1] = RotateL(c, leftCount);
      rotatel_d[i - 1] = RotateL(d, leftCount);
    }
    else {
      leftCount += loop_2;
      rotatel_c[i - 1] = RotateL(c, leftCount);
      rotatel_d[i - 1] = RotateL(d, leftCount);
    }
  }
  for (i = 0; i < 16; i++) {
    for (j = 0; j < 28; j++) {
      pc_2[i][j] = rotatel_c[i][j];
      pc_2[i][j + 28] = rotatel_d[i][j];
    }
  }
  for (i = 0; i < 16; i++) {
    Subkey[i] = PC_2(pc_2[i], PC2_Table);
  }
  return Subkey
}


//在此次项目应用,单DES一次运算时间约30ms
const DES_Encrypt = (key_in, input) =>
{
  let Ip = [];//存储初始置换后的矩阵
  let output_1 = new Array(64).fill(0);
  let subkeys = createArr(16, 48)
  let key = [];
  let l = createArr(17, 32)
  let r = createArr(17, 32)
  let i, j, t, k;

  output_1 = CharToBit(input);//正确,转换为64个二进制数的操作正确！
  Ip = IP(output_1, IP_Table);//正确，IP初始置换！
  key = CharToBit(key_in);//正确！
  subkeys = subKey_fun(key, subkeys);//正确！

  for (i = 0; i < 32; i++) {
    l[0][i] = Ip[i];
    r[0][i] = Ip[32 + i];
  }
  for (j = 1; j < 16; j++)//前15轮的操作
  {
    for (k = 0; k < 32; k++) {
      l[j][k] = r[j - 1][k];
    }
    r[j] = F_func(r[j - 1], subkeys[j - 1]);
    r[j] = Xor(r[j], l[j - 1], 32);
  }

  for (t = 0; t < 32; t++)//最后一轮的操作
  {
    r[16][t] = r[15][t];
  }
  l[16] = F_func(r[15], subkeys[15]);
  l[16] = Xor(l[16], l[15], 32);
  for (t = 0; t < 32; t++) {
    output_1[t] = l[16][t];
    output_1[32 + t] = r[16][t];
  }
  Ip = IP_In(output_1, Ip, IPR_Table);
  return BitToChar(Ip);//正确?
}
module.exports = {
  DES_Encrypt: DES_Encrypt
}