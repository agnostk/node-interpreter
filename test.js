import { exec } from "child_process";

const TEST_FILES_BASE_PATH = "./test";

const TEST_SUITE = [
  {
    filename: "1.json",
    expected: "Hello World!",
  },
  {
    filename: "2.json",
    expected: 123,
  },
  {
    filename: "3.json",
    expected: "123",
  },
  {
    filename: "4.json",
    expected: true,
  },
  {
    filename: "5.json",
    expected: false,
  },
  {
    filename: "6.json",
    expected: 579,
  },
  {
    filename: "7.json",
    expected: -333,
  },
  {
    filename: "8.json",
    expected: 56088,
  },
  {
    filename: "9.json",
    expected: 4,
  },
  {
    filename: "10.json",
    expected: 0.26973684210526316,
  },
  {
    filename: "11.json",
    expected: true,
  },
  {
    filename: "12.json",
    expected: true,
  },
  {
    filename: "13.json",
    expected: true,
  },
  {
    filename: "14.json",
    expected: false,
  },
  {
    filename: "15.json",
    expected: false,
  },
  {
    filename: "16.json",
    expected: true,
  },
  {
    filename: "17.json",
    expected: true,
  },
  {
    filename: "18.json",
    expected: false,
  },
  {
    filename: "19.json",
    expected: false,
  },
  {
    filename: "20.json",
    expected: false,
  },
  {
    filename: "21.json",
    expected: true,
  },
  {
    filename: "22.json",
    expected: false,
  },
  {
    filename: "23.json",
    expected: true,
  },
  {
    filename: "24.json",
    expected: true,
  },
  {
    filename: "25.json",
    expected: true,
  },
  {
    filename: "26.json",
    expected: false,
  },
  {
    filename: "27.json",
    expected: false,
  },
  {
    filename: "28.json",
    expected: false,
  },
  {
    filename: "29.json",
    expected: true,
  },
  {
    filename: "30.json",
    expected: true,
  },
  {
    filename: "31.json",
    expected: true,
  },
  {
    filename: "32.json",
    expected: false,
  },
  {
    filename: "33.json",
    expected: true,
  },
  {
    filename: "34.json",
    expected: false,
  },
  {
    filename: "35.json",
    expected: false,
  },
  {
    filename: "36.json",
    expected: false,
  },
  {
    filename: "37.json",
    expected: "Hello World!",
  },
  {
    filename: "38.json",
    expected: "Hello World!",
  },
  {
    filename: "39.json",
    expected: 579,
  },
  {
    filename: "40.json",
    expected: 3,
  },
  {
    filename: "41.json",
    expected: 30,
  },
  {
    filename: "42.json",
    expected: 1,
  },
  {
    filename: "43.json",
    expected: 3,
  },
  {
    filename: "44.json",
    expected: 9,
  },
  {
    filename: "45.json",
    expected: 10,
  },
  {
    filename: "46.json",
    expected: "1\n2",
  },
  {
    filename: "47.json",
    expected: "1\n2\n3\n1",
  },
  {
    filename: "48.json",
    expected: "1\n2\n(1, 2)",
  },
  {
    filename: "49.json",
    expected: "1\n2\n3",
  },
  {
    filename: "50.json",
    expected: 1,
  },
  {
    filename: "51.json",
    expected: "Test\nTest\nTest\nTest\nTest\nfib: 2",
  },
  {
    filename: "52.json",
    expected: 9227465,
  },
  {
    filename: "print.json",
    expected: "Hello world",
  },
  {
    filename: "fib.json",
    expected: 12586269025,
  },
  {
    filename: "sum.json",
    expected: 15,
  },
  {
    filename: "combination.json",
    expected: 337959576966375,
  },
];

let successCount = 0;
const promises = [];
const summary = [];

class SummaryEntry {
  constructor(status, executionTime, actual = "N/A", expected = "N/A") {
    this.status = status;
    this.executionTime = executionTime;
    this.actual = actual;
    this.expected = expected;
  }
}

TEST_SUITE.forEach((test) => {
  const command = `node index.js -f ${TEST_FILES_BASE_PATH}/${test.filename}`;
  const promise = new Promise((resolve) => {
    const startTime = Date.now();
    exec(command, (error, stdout, stderr) => {
      const executionTime = Date.now() - startTime;
      if (error) {
        console.error(`error: ${error.message}`);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      const result = test.expected + "\n" === stdout;
      if (result) {
        successCount++;
        summary[test.filename] = new SummaryEntry("OK", executionTime);
      } else {
        summary[test.filename] = new SummaryEntry(
          "FAIL",
          executionTime,
          stdout,
          test.expected
        );
      }
      resolve();
    });
  });
  promises.push(promise);
});

Promise.all(promises).then(() => {
  if (successCount === TEST_SUITE.length) {
    console.table(summary, ["status", "executionTime"]);
    console.log("All tests passed");
  } else {
    console.table(summary);
    console.log(`${successCount} of ${TEST_SUITE.length} tests passed`);
  }
});
