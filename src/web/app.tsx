import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import './styles.css';

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const chunk = <T extends any[]>(arr: T, size: number): string[][] => {
  return arr.reduce(
    (newArray, _, i) => (i % size ? newArray : [...newArray, arr.slice(i, i + size)]),
    [] as T[][]
  )
};

const getSeparatedText = (chunked: string[][]) => {
  return chunked
    .map((c) => c.join('\n'))
    .join('\n===\n');
};

const calculateDiff = (a: string[][], b: string[][]) => {
  let result = 999999;
  a.forEach((c) => {
    b.forEach((d) => {
      const length = [...new Set([...c, ...d])].length;
      if (result > length) {
        result = length;
      }
    })
  });
  return result;
};

const App = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const output1Ref = useRef<HTMLTextAreaElement>(null);
  const output2Ref = useRef<HTMLTextAreaElement>(null);

  const onClick = useCallback(() => {
    if (!inputRef.current || !numberRef.current) return;
    const { value } = inputRef.current;
    const { value: numStr } = numberRef.current;

    const num = parseInt(numStr);
    const rows = value.split('\n');

    if (output1Ref.current && output2Ref.current) {
      const firstChunked = chunk(shuffle(rows), num);

      let targetChunked = firstChunked;
      let sim = -1;
      for (let i = 0; i < 30; i++) {
        const randomChunked = chunk(shuffle(rows), num);
        const tmp = calculateDiff(firstChunked, randomChunked);
        if (sim < tmp) {
          sim = tmp;
          targetChunked = [...randomChunked];
        }
      }

      output1Ref.current.value = getSeparatedText(firstChunked);
      output2Ref.current.value = getSeparatedText(targetChunked);
    }
  }, []);

  return (
    <div>
      <div className="flex">
        <div className="column">
          <h2>参加者一覧</h2>
          <p>対象者</p>
          <textarea ref={inputRef} rows={15} />
          <label><input ref={numberRef} type="number" defaultValue={1} />人ずつに分ける</label>
          <button className="button" onClick={onClick}>抽選</button>
        </div>
        <div className="column">
          <h2>組分け</h2>
          <p>1回目</p>
          <textarea ref={output1Ref} rows={15} />
          <p>2回目</p>
          <textarea ref={output2Ref} rows={15} />
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
