const core = require("@actions/core");
const exec = require("child_process").exec;

const stackName = core.getInput("StackName");
console.log("stackName:", stackName);
const outputsString = core.getInput("Outputs");
const outputNames = outputsString.split(",").map(function (str) {
  return str.trim();
});

const camelToSnakeCase = (str) => {
  const tranformed = str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .toUpperCase();
  return tranformed.startsWith("_") ? tranformed : tranformed.slice(1);
};

const getOutputScript = function (desiredOutput) {
  return `aws cloudformation describe-stacks  --query "Stacks[?StackName=='${stackName}'][].Outputs[?OutputKey=='${desiredOutput}'].OutputValue" --output text`;
};

const getOutput = function (outputName) {
  const outputScript = getOutputScript(outputName);
  return new Promise(function (resolve) {
    exec(outputScript, function (_, outputScriptResult) {
      resolve(outputScriptResult);
    });
  });
};

async function main() {
  for (const desiredOutput of outputNames) {
    console.log("desiredOutput:", desiredOutput);
    const result = await getOutput(desiredOutput);
    console.log("result:", result);
    const finalOutputName = camelToSnakeCase(desiredOutput);
    core.setOutput(finalOutputName, result);
  }
}

main();
