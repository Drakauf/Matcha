<h1 align="center">
Matcha 
</h1>

<h3 align="center"><b>Description</b></h3>
<p>Ce second projet vous introduit à un outil plus évolué pour réaliser vos applications web : le micro-framework. Nous vous invitons à réaliser, dans le langage de votre choix, un site de rencontres. Les interactions entre utilisateurs seront au coeur du projet !</p>

<p><b>Objectif :</b> Créer un site de rencontre.</p>
<p><b>Langage :</b> Javascript.</p>
<p><b>Base de données :</b> MySql.</p>
<p><b>[Micro]Framework :</b> NodeJs Express.</p>
<p><b>Template :</b> Pug.</p>
<p><b>Libraries principales:</b> Socket.io, jquery, bootstrap.</p>

<h3 align="center"><b>Fonctionalité</b></h3>
<ul><b>Compte utilisateur</b></ul>
<li> Creation de compte </li>
<li> Profil Etendu </li>
<ul><b>Suggestion de compatibilité</b></ul>
<li> Algoritme de match </li>
<li> Differents filtre de recherche</li>
<li> Geolocalisation </li>
<ul><b>Chat et notification</b></ul>
<li>Messagerie en temps réel</li>
<li>Notification en temps réel des vue du profil, matchs, unmatchs et match retours</li>

<h3 align="center">Lancer le site</h3>
* docker-compose up </br>
* configurer le mail dans le fichier app/src/middlewares/Validator.js </br>
* localhost:8080/setup (création de la base de donnée, accessible via phpmyadmin localhost:8003)</br>
* localhost:8080/faker (générateur de faux profil(501))</br>
* localhost:8080 profiter pleinement du site</br>

<h3 align="center"> Documentation </h3>

Express framework
https://expressjs.com/

Express session usage
https://www.tutorialspoint.com/expressjs/expressjs_sessions.htm

Bootstrap framework for grid layout and easy css
https://getbootstrap.com/docs/4.0/getting-started/introduction/ https://www.w3schools.com/bootstrap/bootstrap_modal.asp

Convertir html en pug
http://www.html2jade.org/

Socket
https://socket.io/docs/
<p align="right">
Made with Love by 
<a href=https://github.com/Aelaiig>aweiler</a> and 
<a href=https://github.com/Drakauf>shthevak</a></p>

