const readline = require('readline');
const fs = require('fs');
var arrayOne=[];
const rl = readline.createInterface({
  input: fs.createReadStream('Agricultural_production_csv.csv')
});
rl.on('line', (line) => {
    arrayOne.push(line);
  })
.on('close', () => {
  out(arrayOne);
  process.exit(0);
});
function out(arrayOne)
{
  var header=arrayOne[0].split(',');//array for storing the title of columns
  var noOfRow=arrayOne.length;
  var noOfCol=header.length;
  var index=(header.indexOf(' 3-2013'))+1;
  oilseeds();
  foodgrains();
  commercialCrops();
  riceProduction();
/*-------------------------------------oilseeds vs production-------------------------------------------------------------------*/
  function oilseeds()
  {
    var oilseedsarray=[];//array to store the objects of oilseeds
    for(var i=0;i<noOfRow;i++)//loop to extract the oilseed rows from csv file
    {
      var row=arrayOne[i].split(',');//array to store the i-th row
      var cropname=row[0];   
      var count1=(cropname.match(/Oilseeds /g) || []).length;
      var count2=(cropname.match(/Nine/g) || []).length;
      if(count1==1 && count2==0)
        {
          var count3=(cropname.match(/Major/g) || []).length;
          if(count3==0)
            {
              var obj = {};
              obj[header[0]] = row[0].replace('Agricultural Production Oilseeds ','');
              obj["Production"]=row[index];
              oilseedsarray.push(obj);    
            }
        } 
    }//end of for loop
    console.log(oilseedsarray);
    console.log("--------------------------------------------------------------------------------");
    fs.writeFileSync('oilseeds_vs_production_json.json',JSON.stringify(oilseedsarray));
  }//end of oilseeds function
/*-------------------------------------foodgrains vs production-------------------------------------------------------------------*/
  function foodgrains()
  {
    var foodgrainsarray=[];//array to store the objects of foodgrains
    for(var i=0;i<noOfRow;i++)//loop to extract the foodgrain rows from csv file
    {
      var row=arrayOne[i].split(',');
      var cropname=row[0];
      var count=(cropname.match(/Foodgrains /i) || []).length;
      if(count>0)
        {
            var count1=(cropname.match(/area/i) || []).length;
            var count2=(cropname.match(/volume/i) || []).length;
            var count3=(cropname.match(/yield/i) || []).length;
            var count4=(cropname.match(/Production/g) || []).length;
            var count5=(cropname.match(/major crops/i) || []).length;
            if(count1==0 && count2==0 && count3==0 && count4==1 && count5==0)
             {
               var obj = {};
               obj[header[0]] = row[0].replace('Agricultural Production Foodgrains ','');
               obj["production"]=row[index];
               foodgrainsarray.push(obj);    
             }
        } 
    }//end of for loop
    console.log(foodgrainsarray);
    console.log("-------------------------------------------------------------------------------");
    fs.writeFileSync('foodgrains_vs_production_json.json',JSON.stringify(foodgrainsarray));
  }//end of foodgrains function
/*-------------------------------------commercial crops vs production------------------------------------------------------------------*/
  function commercialCrops()
  {
    var commercialcrops=[];//array to store the objects of commercial crops
    var startindex=header.indexOf(' 3-1993')+1;
    var endindex=header.indexOf(' 3-2014')+1;
    for(var k=startindex;k<=endindex;k++)//loop to extract the commercial crop rows from csv file
    {
       var total=0;//stores the total production for k-th year
       for(var i=0;i<noOfRow;i++)
         {
           var row=arrayOne[i].split(',');
           var cropname=row[0];   
           var count1=(cropname.match(/Commercial Crops/g) || []).length;
           var count2=(cropname.match(/Jute and Mesta/g) || []).length;
           if(count1==1 && (!(row[k]=="NA")) && count2==0)
             {
               var production=Number(row[k]);
               total=total+production;
             }              
         }//end of for loop
         var obj = {};
         obj["year"] = header[k-1].substring(3);
         obj["production"]=total;
         commercialcrops.push(obj);        
    }//end of for loop
    console.log(commercialcrops);
    console.log("-----------------------------------------------------------------------------");
    fs.writeFileSync('commercialcrops_vs_production_json.json',JSON.stringify(commercialcrops));
  }//end of commercialCrops function
/*-------------------------------------Rice production of four southern states---------------------------------------------------------------------*/
  function riceProduction()
  {
    var ricearray=[];
    var startindex=header.indexOf(' 3-1993');
    var endindex=header.indexOf(' 3-2014')+1;
    for(var k=startindex;k<endindex;k++)//loop to extract the rice yield rows from csv file
    {      
      var obj={};
      for(var i=0;i<noOfRow;i++)
        {
          var year=header[k];
          var row=arrayOne[i].split(','); 
          var cropname=row[0];   
          var count=(cropname.match(/Rice Yield/g) || []).length;
          if(count==1)
            {              
              var count1=(cropname.match(/Andhra Pradesh/g) || []).length;
              var count2=(cropname.match(/Karnataka/g) || []).length;
              var count3=(cropname.match(/Tamil Nadu/g) || []).length;
              var count4=(cropname.match(/Kerala/g) || []).length;
              if(count1>0 || count2>0 || count3>0 || count4>0)
                {
                  if(row[k+1]=="NA")
                    row[k+1]="0";
                  year =header[k].substring(3);
                  obj["year"]=year;
                  obj[row[0]]=row[k+1];                       
                }
                
            }              
        } //end of for loop 
      ricearray.push(obj); 
    }//end of for loop
    console.log(ricearray);
    fs.writeFileSync('riceproduction_json.json',JSON.stringify(ricearray));
    } //end of commercial crops function
} //end of out function
 