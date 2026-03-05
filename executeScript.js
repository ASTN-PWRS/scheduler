import { PythonShell } from "python-shell";

export async function executeScript(scriptName, args) {
  const options = {
    args: JSON.stringify(args),
  };
  const startTime = new Date();

  console.log(`Executing script: ${scriptName}`);

  try {
    const results = await new Promise((resolve, reject) => {
      PythonShell.run(scriptName, options, (error, results) => {
        if (error) {
          return reject(error); // エラーがあればPromiseをreject
        }
        resolve(results); // 成功時に結果をresolve
      });
    });

    return {
      results: results.join("\n"),
      startTime: startTime,
      endTime: new Date(),
    };
  } catch (error) {
    return {
      error: error.message,
      startTime: startTime,
      endTime: new Date(),
    };
  }
}
