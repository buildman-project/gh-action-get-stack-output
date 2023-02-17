const core = require("@actions/core");
const exec = require("child_process").exec;

const stackName = core.getInput("StackName");
const outputsString = core.getInput("Outputs");
const outputNames = outputsString.split(",").map(function (str) {
  return str.trim();
});

const getOutputScript = function (desiredOutput) {
  return `aws cloudformation describe-stacks  --query "Stacks[?StackName=='${stackName}'][].Outputs[?OutputKey=='${desiredOutput}'].OutputValue" --output text`;
};

const getOutput = function (outputName) {
  const outputScript = getOutputScript(outputName);
  console.log("outputScript:", outputScript);
  return new Promise(function (resolve) {
    exec(outputScript, function (_, outputScriptResult) {
      resolve(outputScriptResult);
    });
  });
};

async function main() {
  for (const desiredOutput of outputNames) {
    const result = await getOutput(desiredOutput);
    console.log("output:", desiredOutput);
    console.log("result:", result);
    core.setOutput(desiredOutput, result);
  }

  core.setOutput("TestOutput", "TestValue");
}

main();
