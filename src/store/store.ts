import { create } from "zustand";

type State = {
  baseUrl: string;
  gain: string;
  gainMode: string;
  centerFreq: string;
  bandwidth: string;
  samplingRate: string;
  setBaseUrl: (val: string) => void;
  setGain: (val: string) => void;
  setGainMode: (val: string) => void;
  setCenterFreq: (val: string) => void;
  setBandwidth: (val: string) => void;
  setSamplingRate: (val: string) => void;
};

const useStore = create<State>((set) => ({
  baseUrl: "http://192.168.1.8:8000",
  // baseUrl: "https://refined-magnetic-buck.ngrok.io",
  gain: "0",
  gainMode: "slow_attack",
  centerFreq: "1850",
  bandwidth: "56",
  samplingRate: "61.44",
  setBaseUrl: (val: string) => {
    set(() => ({
      baseUrl: val,
    }));
  },
  setGain: (val: string) => {
    set(() => ({
      gain: val,
    }));
  },
  setGainMode: (val: string) => {
    set(() => ({
      gainMode: val,
    }));
  },
  setCenterFreq: (val: string) => {
    set(() => ({
      centerFreq: val,
    }));
  },
  setBandwidth: (val: string) => {
    set(() => ({
      bandwidth: val,
    }));
  },
  setSamplingRate: (val: string) => {
    set(() => ({
      samplingRate: val,
    }));
  },
}));

export default useStore;
