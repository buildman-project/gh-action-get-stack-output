const core = require("@actions/core");
const exec = require("child_process").exec;

const stackName = core.getInput("StackName");
const outputsString = core.getInput("Outputs");
const outputs = outputsString.split(",").map((str) => str.trim());

const getOutputScript = function (desiredOutput) {
  return `aws cloudformation describe-stacks  --query "Stacks[?StackName=='${stackName}'][].Outputs[?OutputKey=='${desiredOutput}'].OutputValue" --output text`;
};

for (const output of outputs) {
  const outputScript = getOutputScript(output);

  exec(outputScript, function (_, outputScriptResult, _) {
    core.setOutput(output, outputScriptResult);
  });
}
