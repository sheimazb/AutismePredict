const URL = "https://teachablemachine.withgoogle.com/models/CJ8vmJGlU/";
/*const URL = "https://teachablemachine.withgoogle.com/models/XGAwGsTRo/";*/
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 500;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}
async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}
let totalTime={};
async function predict() {
    
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const classPrediction = `${className}: ${probability}`;
    //    labelContainer.childNodes[i].innerHTML = classPrediction;
//console.log(probability);
        if (probability > 0.50) {
            // Check if the class exists in totalTime dictionary
            if (!totalTime[className]) {
                totalTime[className] = 0.1; // Initialize with 0.01 seconds
            } else {
                totalTime[className] += 0.1; // Add 0.01 seconds
            }
        }
    }
    // finally draw the poses
    drawPose(pose);

    // Log the totalTime dictionary
  //  console.log(totalTime);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

/*partie d'envoie des donnees*/

async function envoyerDonnees() {
    // Transform totalTime dictionary to match the classDetails array structure
    const classDetailsArray = Object.entries(totalTime).map(([className, totalTime]) => ({
        className,
        totalTime: totalTime.toString(), // Assuming totalTime should be stored as a String in your schema
    }));

    // Now, the classDetailsArray has the same structure as required by your Mongoose schema
    const dataForServer = {
        classDetails: classDetailsArray,
    };

    console.log(dataForServer);

    try {
        const response = await fetch('http://127.0.0.1:8000/classTracker/insertListTimeTracker', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataForServer),
        });

        if (response.ok) {

            console.log('Données envoyées avec succès au serveur');
            const responseData = await response.json();
            console.log(responseData);
        } else {
            console.error('Erreur lors de l\'envoi des données au serveur');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données au serveur', error);
    }
}

  // Appeler la fonction pour envoyer les données lorsque le bouton est cliqué
  const boutonEnvoyer = document.querySelector('.button-upload button');
  boutonEnvoyer.addEventListener('click', envoyerDonnees);