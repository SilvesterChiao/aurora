window.onload = function () {
    const ajax = document.getElementById('ajax');
    console.log(`ajax:${ajax.innerHTML}`);
    console.log(`父节点(parentNode)：${ajax.parentNode.innerHTML}`);
    console.log(`上一个兄弟节点previousSibling:${ajax.previousSibling.previousSibling.innerHTML}`);
    console.log(`下一个兄弟节点nextSibling:${ajax.nextSibling.nextSibling.innerHTML}`);
    console.log(`第一个子节点(firstChild):${ajax.parentNode.firstChild.nextSibling.innerHTML}`);
    console.log(`最后一个子节点(lastChild):${ajax.parentNode.lastChild.previousSibling.innerHTML}`);
    console.log(`所有子节点:${ajax.parentNode.childNodes.length}`);
};
