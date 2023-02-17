const core = require("@actions/core");
const exec = require("child_process").exec;

const stackName = core.getInput("StackName");
const outputsString = core.getInput("Outputs");
const outputs = outputsString.split(",").map((str) => str.trim());

const getOutputScript = function (desiredOutput) {
  return `aws cloudformation describe-stacks  --query "Stacks[?StackName=='${stackName}'][].Outputs[?OutputKey=='${desiredOutput}'].OutputValue" --output text`;
};

for (const output of outputs) {
  console.log('output:', output)
  const outputScript = getOutputScript(output);
  console.log('outputScript:', outputScript)

  exec(outputScript, function (_, outputScriptResult, _) {
    console.log('outputScriptResult:', outputScriptResult)
    core.setOutput(output, outputScriptResult);
  });
}
