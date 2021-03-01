// Your JS Script here

function readInput(){
    var text = document.getElementById('texto').value

    if(!text){
      alert("Escreva texto no input")
    }else{
        document.getElementById('textoFromInput').innerText = text
    }

}