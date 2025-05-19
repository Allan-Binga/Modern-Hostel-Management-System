function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <span
        className="loader inline-block w-[1em] h-[1em] text-[#800020] text-[45px] text-indent-[-9999em] overflow-hidden rounded-full relative animate-[mltShdSpin_1.7s_infinite_ease,round_1.7s_infinite_ease]"
        aria-label="Loading"
        role="status"
      ></span>

      <style>{`
        @keyframes mltShdSpin {
          0% {
            box-shadow: 0 -0.83em 0 -0.4em #800020,
                        0 -0.83em 0 -0.42em #800020, 
                        0 -0.83em 0 -0.44em #800020,
                        0 -0.83em 0 -0.46em #800020, 
                        0 -0.83em 0 -0.477em #800020;
          }
          5%, 95% {
            box-shadow: 0 -0.83em 0 -0.4em #800020, 
                        0 -0.83em 0 -0.42em #800020, 
                        0 -0.83em 0 -0.44em #800020, 
                        0 -0.83em 0 -0.46em #800020, 
                        0 -0.83em 0 -0.477em #800020;
          }
          10%, 59% {
            box-shadow: 0 -0.83em 0 -0.4em #800020, 
                        -0.087em -0.825em 0 -0.42em #800020, 
                        -0.173em -0.812em 0 -0.44em #800020, 
                        -0.256em -0.789em 0 -0.46em #800020, 
                        -0.297em -0.775em 0 -0.477em #800020;
          }
          100% {
            box-shadow: 0 -0.83em 0 -0.4em #800020, 
                        0 -0.83em 0 -0.42em #800020, 
                        0 -0.83em 0 -0.44em #800020, 
                        0 -0.83em 0 -0.46em #800020, 
                        0 -0.83em 0 -0.477em #800020;
          }
        }

        @keyframes round {
          0% { transform: rotate(0deg) }
          100% { transform: rotate(360deg) }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
