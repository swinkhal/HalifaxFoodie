/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 'use strict';
 exports.helloWorld = (req, res) => {
   
    const aiplatform = require('@google-cloud/aiplatform');
  const {instance, prediction} =
    aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

  // Imports the Google Cloud Model Service Client library
  const {PredictionServiceClient} = aiplatform.v1;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','*');
  res.setHeader('Access-Control-Allow-Headers','*');

  // Specifies the location of the api endpoint
  const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  };

  const project = "serverlessprojectgroup5"
//   const location = "us-central1 (Iowa)"
  const location = "us-central1"
  const endpointId = "1668763981847724032"

  // Instantiates a client
  const predictionServiceClient = new PredictionServiceClient(clientOptions);
  const data = JSON.parse((req.body) || {})
  const text = data.text
  async function predictTextClassification() {
    // Configure the resources
    const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

    const predictionInstance =
      new instance.TextClassificationPredictionInstance({
        content: text,
      });
    const instanceValue = predictionInstance.toValue();

    const instances = [instanceValue];
    const request = {
      endpoint,
      instances,
    };

    const [response] = await predictionServiceClient.predict(request);
    
    let response_data = []

    for (const predictionResultValue of response.predictions) {
      const predictionResult =
        prediction.ClassificationPredictionResult.fromValue(
          predictionResultValue
        );

      for (const [i, label] of predictionResult.displayNames.entries()) {
        let dict = {}
        dict['label'] = label
        dict['confidence'] = predictionResult.confidences[i]
        response_data.push(dict);
      }
    }
    console.log(response_data);

    return res.status(200).send(response_data);

  }
  predictTextClassification();
  
  };