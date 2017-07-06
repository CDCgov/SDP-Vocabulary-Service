export const move = (array, from, to) => {
  let copyArray = array.slice(0);
  copyArray.splice(to, 0, copyArray.splice(from, 1)[0]);
  for(var i = 0; i < copyArray.length; i++){
    copyArray[i].position = i;
  }
  return copyArray;
};
