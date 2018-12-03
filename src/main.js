const axios = require('axios')

const api = axios.create({
    baseURL: 'https://api.github.com/users/',
    headers: {
        'Authorization': {
            username: 'YOUR_GITHUB_USERNAME_HERE',
            password: 'yOUR_GITHUB_PASSWORD_HERE'
        }
    }
});

const apiMds = axios.create({
  baseURL: 'https://api.github.com/orgs/EDAII/',
  headers: {
      'Authorization': {
        username: 'YOUR_GITHUB_USERNAME_HERE',
        password: 'yOUR_GITHUB_PASSWORD_HERE'
      }
  }
});




var req = 0;
const githubs = [];

const githubCrawler = async (githubs) => {    

  var idNumber = 1;

  var preData = {
    nodes: [],
    edges: []
    /*{from: 1, to: 2},*/ 
  }
    
  const nodeFinal = [];
    
  var eps = []
  

  for (let index = 1; index <= 3; index++) {
    var mds = await apiMds.get(`members?page=${index}`, {
      auth: {
        username: 'YOUR_GITHUB_USERNAME_HERE',
        password: 'yOUR_GITHUB_PASSWORD_HERE'
      },
    });

    for (let index = 0; index < mds.data.length; index++) {
      console.log()
      githubs.push(mds.data[index].login);
      
    }
    
    
  }


  console.log(githubs);

  
  
    for (var index in githubs) {
      const user = githubs[index];
         
      const nodeData = [];
      nodeData.push(user);
      const response = await api.get(user, {
          auth: {
            username: 'YOUR_GITHUB_USERNAME_HERE',
            password: 'yOUR_GITHUB_PASSWORD_HERE'
          },
        });

      preData.nodes.push({
        id: idNumber, 
        shape: 'image', 
        image: response.data.avatar_url,
        label: response.data.login
      })  

      req++;

      idNumber++;

      const followersLink = response.data.followers_url;
      const followers = await api.get(followersLink,  {
          auth: {
            username: 'YOUR_GITHUB_USERNAME_HERE',
            password: 'yOUR_GITHUB_PASSWORD_HERE'
          },
        });

        req++;
        
       
       
        for (let a = 0; a < followers.data.length; a++) {
          for (let b = 0; b < githubs.length; b++) {
            if (followers.data[a].login === githubs[b]) {
              nodeData.push(followers.data[a].login);  
             
          }
        }
      }

      nodeFinal.push(nodeData);
    }

    console.log(nodeFinal);
    /*console.log(req);*/
    
    
/*{from: 1, to: 2}###########nodeFinal[leader][0]#########################*/ 

    
  var preEdges= []
  var firstNode;
  var secondNode;

  var nodesWithNames = []

for (let index = 0; index < nodeFinal.length; index++) {
  
  for (let innerIndex = 1; innerIndex < nodeFinal[index].length; innerIndex++) {

    nodesWithNames.push([ nodeFinal[index][0] ,  nodeFinal[index][innerIndex]]);
    
  }
  
}

var preLenght = preData.nodes.length
for (let x = 0; x < nodesWithNames.length; x++) {

  var firstNode = 0;
  var secondNode = 0;

  for (let y = 0; y < preLenght; y++) {
    if ((nodesWithNames[x][0] == preData.nodes[y].label)) {
      firstNode = preData.nodes[y].id;
      
    }
    if ((nodesWithNames[x][1] == preData.nodes[y].label)) {
      secondNode = preData.nodes[y].id;
   
    }    
  }
  if (firstNode < secondNode) {
    preEdges[x] = {from: firstNode, to: secondNode}
  }
  if (secondNode < firstNode) {
    preEdges[x] = {from: secondNode, to: firstNode}
  }

}
  

  var arr = []
  
  for (let index = 0; index < preEdges.length; index++) {
    arr[index]= JSON.stringify(preEdges[index])    
  }



  var parsing = Array.from(new Set(arr));
  
 

  var finalArray = []
  
  for (let index = 0; index < parsing.length; index++) {
    finalArray[index]= JSON.parse(parsing[index]);   
  }

  
  

  for (let index = 0; index < finalArray.length; index++) {
    
    preData.edges.push({
      from: finalArray[index].from, to: finalArray[index].to
    })
    
  }



  
  
    

  



  

  

/*####################################*/ 


   
    return(preData);
}
document.addEventListener('DOMContentLoaded', function() {

  githubCrawler(githubs).then((response) => {

  

    var container = document.querySelector('#graph');
    
    var data = response;
    

    var options = {
      nodes: {
        borderWidth:0,
        size:40,
        color: {
          border: '#222',
          background: 'transparent'
        },
        font: {
          color: '#111',
          face: 'Montserrat',
          size: 20,
        }
      },
      edges: {
        color: {
          color: '#0061ff',
          highlight: '#0061ff'
        },
        width: 4,
        length: 1000,
        
      }
    }
    
    var network = new vis.Network(container, data, options);
    
  });
});