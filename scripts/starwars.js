"use strict";

// Set up eventlistners
let btnSearch = document.querySelector('#btnSearch').addEventListener('click', Search);

let txtAreaResult = document.getElementById('txtAreaResult');


function Search()
{
    let txtSearchFor = document.getElementById('txtSearchFor').value;    
    txtAreaResult.value = '';

    if(txtSearchFor)
    {        
        document.getElementById("txtSearchForError").style.display = 'none';

        fetch('http://www.swapi.tech/api/people/?name=' + txtSearchFor)//'http://www.swapi.tech/api/people/?name=chewbacca')
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                ShowData(data);
            })
            .catch(err => {
                console.error(err);

                txtAreaResult.value = 'Error:' + err;
            })
    }
    else    
    {
        document.getElementById("txtSearchForError").style.display = "";
    }
}


function ShowData(data)
{
    if(data && data.result[0])
    {
        let strName = data.result[0].properties.name;
        if(strName && strName === 'n/a')
            strName = 'okänt';

        let strMass = data.result[0].properties.mass;
        if(strMass && strMass === 'n/a')
            strMass = 'okänd';

        let strHeight = data.result[0].properties.height;
        if(strHeight && strHeight === 'n/a')
            strHeight = 'okänd';

        let strHairColor = data.result[0].properties.hair_color;
        if(strHairColor && strHairColor === 'n/a')
            strHairColor = 'okänd';

        let strData = `${strName} är en ${TranslateGender(data.result[0].properties.gender)}.\nVäger ${strMass} kilo.\nÄr ${strHeight} centimeter hög.\nHar ${strHairColor} hårfärg`;

        txtAreaResult.value = strData;
    }
    else
    {
        txtAreaResult.value = 'Sökningen gav inget resultat';
    }
}


function TranslateGender(gender)
{
    let newGender = gender;
    if(gender === 'male')
        newGender = 'man';
    else if(gender === 'female')
        newGender = 'kvinna';
    else if(gender == 'n/a')
        newGender = 'hen';

    return newGender;
}