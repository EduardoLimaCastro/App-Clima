const temp = document.getElementById("temp");
const dateElement = document.querySelector("#date-time");
const cidadeElement = document.querySelector("#location");
const condicaoElement = document.querySelector("#condition");
const uvIndexElement = document.querySelector(".uv-index");
const uvStatusIndexElement = document.querySelector(".uv-text")
const ventoElement = document.querySelector(".vento");
const ventoStatusElement = document.querySelector(".vento_status");
const ventoDirStatusElement = document.querySelector(".grau_ponteiro");
const pordosolElement = document.querySelector(".sol-por");
const nascerdosolElement = document.querySelector(".sol-nasc");
const umidadeElement = document.querySelector(".umidade");
const umidadeStatusElement = document.querySelector(".umidade_status")
const visibilidadeElement = document.querySelector(".visibilidade");
const visibilidadeStatusElement = document.querySelector(".visibilidade_status");
const chuvaElement = document.querySelector("#rain2");
const luaElement = document.querySelector(".fase_lua");
const IconePrincipalElement = document.querySelector("#icon")
const tempMaxElement = document.querySelector(".temp_max");
const tempMinElement = document.querySelector(".temp_min");
const tempoCardsElement = document.querySelector("#weather-cards")
const btnHojeElement = document.querySelector(".hourly")
const btnSemanaElementElement = document.querySelector(".week")
const darkModeElement = document.querySelector("#change-theme")
const searchElement = document.querySelector("#search")
const searchQueryElement = document.querySelector("#query")

let cidade ="";
let unidade = "C"
let horarioSemanal = "Semana";

// ATUALIZAR HORÁRIO ///
function getHorario() {
    let now = new Date(),
        hour = now.getHours(),
        hour2 = now.getHours(),
        minute = now.getMinutes();
    
    let dias = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ];

    //FORMATO 12 HORAS
    hour = hour % 12;
    if (hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }

    let stringDia = dias[now.getDay()];
    
    if(hour2 <12){
    return `${stringDia}, ${hour}:${minute} AM`;
    }else{
    return `${stringDia}, ${hour}:${minute} PM`;
    }
    
}

dateElement.innerText = getHorario();

//ATUALIZAR A CADA SEGUNDO ///
setInterval(() =>{
    dateElement.innerText = getHorario();
},1000);

//funçao para IP ///
async function getIP() {
    await fetch("https://geolocation-db.com/json/", {
        method:"GET",
    }).then((response) => response.json())
        .then((data) => {
            console.log(data)
            cidade = data.city;
            getWeatherData(cidade, horarioSemanal)
    });
}

getIP();

//FUNÇÃO PARA DADOS CLIMÁTICOS ///
async function getWeatherData(cidade,horarioSemanal){
    try{
        const response1 = await fetch(`https://backend-clima.vercel.app/${cidade}`)
        {
            method: "GET"
        }
        const data = await response1.json();
        console.log(data);
        let hoje = data.currentConditions;
        if(unidade =="C"){
            temp.innerText = hoje.temp;
        }else{
            temp.innerText = celciusFahrenheit(hoje.temp);
        }
        
        cidadeElement.innerText = data.resolvedAddress;
        condicaoElement.innerText = data.currentConditions.conditions;
        chuvaElement.innerText = (hoje.precipprob || 0)  + "%";
        uvIndexElement.innerText = hoje.uvindex;
        ventoElement.innerText = hoje.windspeed + " km/h";
        ventoDirStatusElement.innerText = hoje.winddir + "°C";
        umidadeElement.innerText = hoje.humidity + "%";
        visibilidadeElement.innerText = hoje.visibility;  
        const leituravento = hoje.winddir;
        const graus = parseFloat(leituravento)
        const pontElement = document.querySelectorAll("img.ponteiro");
        pontElement[0].style.transform = `rotate(${graus}deg)`;
        nascerdosolElement.innerText = hoje.sunrise;
        pordosolElement.innerText = hoje.sunset;        
        faseDaLua(hoje.moonphase);
        avaliacaoUmidade(hoje.humidity);
        avaliacaoUV(hoje.uvindex);
        avaliacaoVisibilidade(hoje.visibility);
        avaliacaoVelocidadeVento(hoje.windspeed);
        IconePrincipalElement.src = getIcone(hoje.icon);
        tempMaxElement.innerText = "Temp. max: " +data.days[0].tempmax + "°C";
        tempMinElement.innerText = "Temp min: " + data.days[0].tempmin + "°C";
        if( horarioSemanal === "Dia"){
            atualizarPrevisao(data.days[0].hours , unidade, "Dia")
        }else{
            atualizarPrevisao(data.days , unidade, "Semana")
        }
    }catch (error){
        console.error("Erro: ", error);
        getWeatherData(cidade, horarioSemanal)
    }   
    
}
//FUNÇÃO DE CONVERSÃO ///
function celciusFahrenheit(temperatura) {
    return ((temperatura*9)/5 + 32).toFixed(1);
}
//FUNÇÃO IMAGEM DA LUA ///
function faseDaLua(imp){
    const lua = parseFloat(imp);
    if(lua === 0 ){
        luaElement.innerText = "Nova"
        document.getElementById("lua").src = "../src/imgs/Nova.png";
    }else if(lua > 0 && lua < 0.25){
        luaElement.innerText = "Crescente"
        document.getElementById("lua").src = "../src/imgs/Crescente.png"
    }else if(lua === 0.25){
        luaElement.innerText = "Quarto crescente"
        document.getElementById("lua").src = "../src/imgs/quarto_crescente.png"
    }else if(lua > 0.25 && lua < 0.5){
        luaElement.innerText = "Gibosa crescente"
        document.getElementById("lua").src = "../src/imgs/gibosa_crescente.png"
    }else if(lua === 0.5){
        luaElement.innerText = "Cheia"
        document.getElementById("lua").src = "../src/imgs/cheia.png"
    }else if(lua > 0.5 && lua < 0.75){
        luaElement.innerText = "Gibosa minguante"
        document.getElementById("lua").src = "../src/imgs/gibosa_minguante.png"
    }else if(lua === 0.75){
        luaElement.innerText = "Quarto minguante"
        document.getElementById("lua").src = "../src/imgs/quarto_minguante.png"
    }else{
        luaElement.innerText = "Minguante"
        document.getElementById("lua").src = "../src/imgs/Minguante.png"
    }

}
//FUNÇÃO AVALIAÇÃO UMIDADE ///

function avaliacaoUmidade(umid){
    if(umid <= 30){
        umidadeStatusElement.innerText = "Baixo";
    }else if(umid <= 60){
        umidadeStatusElement.innerText = "Moderado";
    }else{
        umidadeStatusElement.innerText = "Alto"
    }
 }
//FUNÇÃO AVALIAÇÃO INDICE UV ///
function avaliacaoUV(uv){
    if(uv <= 2){
        uvStatusIndexElement.innerText = "Baixo"
    }else if(uv <=5){
        uvStatusIndexElement.innerText = "Moderado"
    }else if( uv <=7){
        uvStatusIndexElement.innerText = "Alto"
    }else if( uv<=10){
        uvStatusIndexElement.innerText = "Muito Alto"
    }else{
        uvStatusIndexElement.innerText = "Extremo"
    }
}
//FUNÇÃO AVALIAÇÃO VISIBILIDADE ///
function avaliacaoVisibilidade(vis){
    if(vis <= 0.3){
        visibilidadeStatusElement.innerText = "Névoa úmida"
    }else if(vis <=0.16){
        visibilidadeStatusElement.innerText = "Névoa moderada"
    }else if(vis <=0.35){
        visibilidadeStatusElement.innerText = "Névoa leve"
    }else if(vis <=1.13){
        visibilidadeStatusElement.innerText = "Névoa muito leve"
    }else if(vis <=2.16){
        visibilidadeStatusElement.innerText = "Fumaça leve"
    }else if(vis <=5.4){
        visibilidadeStatusElement.innerText = "Fumaça muito leve"
    }else if(vis <=10.8){
        visibilidadeStatusElement.innerText = "Ar limpo"
    }else {
        visibilidadeStatusElement.innerText = "Ar muito Limpo"
    }
}
//FUNÇÃO AVALIAÇÃO VELOCIDADE DO VENTO ///
function avaliacaoVelocidadeVento(vel){
    if(vel <= 18){
        ventoStatusElement.innerText = "Fraco"
    }else if(vel <=35){
        ventoStatusElement.innerText = "Moderado"
    }else if(vel <=44){
        ventoStatusElement.innerText = "Forte"
    }else {
        ventoStatusElement.innerText = "Tempestade"
    }
}
//FUNÇÃO ÍCONE DA PAGINA ///
function getIcone(icone){
    if(icone === 'partly-cloudy-day'){
        return "/src/imgs/partly_cloudy_day_120px.png"
    }else if(icone === 'Partly-cloudy-night'){
        return "/src/imgs/partly_cloudy_night_120px.png"
    }else if(icone === 'rain'){
        return "/src/imgs/rainfal.png"
    }else if(icone === 'clear-day'){
        return "/src/imgs/AccuWeather.svg"
    }else if(icone === 'clear-night'){
        return "/src/imgs/Noitex.png"
    }else {
        return "/src/imgs/AccuWeather.svg"
    }
}
//FUNÇÃO PEGAR DIA ///
function getNomedoDia(data){
    let dia = new Date(data);
    let dias = [        
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
    ];
    return dias[dia.getDay()];
}
//FUNÇÃO PEGAR HORA ///
function getHora(dia){
    let hora = dia.split(":")[0];
    let min = dia.split(":")[1];
    if (hora > 12){
        hora = hora -12;
        return `${hora} : ${min} PM`;
    }else{
        return `${hora} : ${min} AM`;
    }
}
//FUNÇÃO PARA ATUALIZAR A PREVISÃO DIA / SEMANA ///
function atualizarPrevisao(data, unit, type){
    tempoCardsElement.innerHTML = "";

    let day = 0;
    let numCard = 0;
    if(type === "Dia"){
        numCard = 24
    }else{
        numCard = 7
    }
    for( let i = 0; i<numCard;i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let nomeDoDia = getHora(data[day].datetime);
        if (type === "Semana"){
            nomeDoDia = getNomedoDia(data[day].datetime);
        }
        let tamperaturaDoDia = data[day].temp;
        if(unit === "f"){
            tamperaturaDoDia = celciusFahrenheit(data[day].temp);
        }
        let condicaoIcone = data[day].icon;
        let iconeSrc = getIcone(condicaoIcone);
        let unidadeTemperatura = "°C"
        if (unit === "f"){
            unidadeTemperatura = "°F";
        }
        card.innerHTML =
        `
        <h2 class="day-name">${nomeDoDia}</h2>
        <div class="card-icon">
            <img src=${iconeSrc} alt="ícone">
        </div>
        <div class="day-temp">
            <h2 class="temp">${tamperaturaDoDia}</h2>
            <span class="temp-unit">${unidadeTemperatura}</span>
        </div>
        `
        tempoCardsElement.appendChild(card);
        day++;
    }
}
/// FUNÇÃO MUDAR PERIODO TEMPORAL DE HOJE PARA SEMANA ///
function mudarPeriodo(dado){
    if(horarioSemanal != dado){
        horarioSemanal = dado;
        if (dado === "Dia"){
            btnHojeElement.classList.add("active");
            btnSemanaElementElement.classList.remove("active")
        }else{
            btnHojeElement.classList.remove("active");
            btnSemanaElementElement.classList.add("active")
        }
        //atualizar
        getWeatherData(cidade, horarioSemanal)
    }
}


//BOTÕES ///
//BOTÃO HOJE ///
btnHojeElement.addEventListener("click", () => {
    mudarPeriodo("Dia");
})
btnSemanaElementElement.addEventListener("click", ()=>{
    mudarPeriodo("Semana");
})

searchElement.addEventListener("submit", (e)=>{
    e.preventDefault();
    let location = searchQueryElement.value;
    if(location){
        cidade = location
        getWeatherData(cidade, horarioSemanal);
    }
})

let cidades = [
    "Recife",
    "Fortaleza",
    "Natal",
    "São Paulo",
    "Rio de Janeiro",
    "Paris",
    "Roma"
];


var focoAtual;

searchQueryElement.addEventListener("input", function(e){
    removerSugestões()
    var a, b, i, val = this.value;
    if(!val){
        return false
    }
    focoAtual = -1;
    a=document.createElement("ul");
    a.setAttribute("id","sugestoes");
    this.parentNode.appendChild(a);
    for(i=0;i<cidades.length;i++){
        if(cidades[i].substring(0,val.length).toUpperCase() == val.toUpperCase()){
            b = document.createElement("li");
            b.innerHTML = "<strong>" + cidades[i].substring(0,val.length) + "</strong>";
            b.innerHTML += cidades[i].substring(val.length);
            b.innerHTML += "<input type='hidden' value='" + cidades[i] + "'>";
            b.addEventListener("click", function(e){
                console.log(b.value)
                searchQueryElement.value = this.getElementsByTagName("input")[0].value;
                removerSugestões()
            });

            a.appendChild(b);
        }
    }
})

function removerSugestões(){
    var x = document.getElementById("sugestoes");
    if(x) x.parentNode.removeChild(x);
}
searchQueryElement.addEventListener("keydown", function(e){
    var x = document.getElementById("sugestoes");
    if(x) x = x.getElementsByTagName("li");
if(e.keyCode == 40){
    focoAtual++;
    addAtivo(x);
}else if(e.keyCode == 38){
    focoAtual--;
    addAtivo(x);
}
if(e.keyCode == 13){
    e.preventDefault();
    if(focoAtual > -1){
        if (x) x[focoAtual].click();
    }
}   
})
function addAtivo(int){
    if(!int) return false;
    removerAtivo(int);

    if(focoAtual >= x.length) focoAtual = 0;
    if(focoAtual <0) focoAtual = int.length -1;

    int[focoAtual].classList.add("active");


}

function removerAtivo(x){
    for (var i = 0;i<x.length;i++){
        x[i].classList.remove("active");
    }
}
/// DARKMODE///
    
    darkModeElement.addEventListener("change",() => {
        document.body.classList.toggle("dark")
        document.querySelector(".sidebar").classList.toggle("dark")
        document.querySelector(".condition").classList.toggle("dark")
    })
