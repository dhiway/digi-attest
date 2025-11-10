// import { useState, useEffect } from "react";

// const TIMER_KEY = "otp_resend_timer";

// export function useOtpTimer(initial = 60) {
//     const getRemainingTime = () => {
//         const saved = localStorage.getItem(TIMER_KEY);
//         if (!saved) return 0;

//         const endTime = Number(saved);
//         const now = Date.now();
//         const diff = Math.floor((endTime - now) / 1000);
//         return diff > 0 ? diff : 0;
//     };

//     const [counter, setCounter] = useState(getRemainingTime());
//     const [disabled, setDisabled] = useState(counter > 0);

//     useEffect(() => {
//         let id: number | undefined;

//         if (disabled && counter > 0) {
//             id = window.setInterval(() => {
//                 setCounter((prev) => prev - 1);
//             }, 1000);
//         }

//         if (counter === 0) {
//             setDisabled(false);
//             localStorage.removeItem(TIMER_KEY);
//         }

//         return () => id && clearInterval(id);
//     }, [counter, disabled]);

//     const startTimer = () => {
//         const end = Date.now() + initial * 1000;
//         localStorage.setItem(TIMER_KEY, end.toString());
//         setCounter(initial);
//         setDisabled(true);
//     };

//     return { counter, disabled, startTimer };
// }
