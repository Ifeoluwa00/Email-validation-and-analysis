import FileTree from './fileTree';

export function createFileTree(input) {
  const fileTree = new FileTree();
  let arrWIthParentId = []
  let arrWithNoParentId = []
  for (let value of input) {
    if (value.parentId === undefined) {
      arrWithNoParentId.push(value)
    }
    else {
      arrWIthParentId.push(value)
    }

  }
  arrWIthParentId = arrWIthParentId.sort((a, b) => a.id - b.id)
  let jointUser = [...arrWithNoParentId, ...arrWIthParentId] //arrWithNoParentId.concat(arrWIthParentId)
  
  //let jointUser = input.sort((a,b)=> a.parentId - b.id)
  


  for (const inputNode of jointUser) {
    const parentNode = inputNode.parentId
      ? fileTree.findNodeById(inputNode.parentId)
      : null;

    fileTree.createNode(
      inputNode.id,
      inputNode.name,
      inputNode.type,
      parentNode
    );
  }

  return fileTree;
}