import React, { useEffect } from "react";

const LogsContext = React.createContext();

export const useLogs = () => React.useContext(LogsContext);

const LogsProvider = ({ children }) => {
  const clusterRef = React.useRef(null);
  const appRef = React.useRef(null);
  const dateRef = React.useRef(null);
  const timeRef = React.useRef(null);
  const podRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [clusterSuggestions, setClusterSuggestions] = React.useState([]);
  const [appSuggestions, setAppSuggestions] = React.useState([]);
  const [podSuggestions, setPodSuggestions] = React.useState([]);
  const [fileSuggestions, setFileSuggestions] = React.useState([]);
  const [filteredClusterSuggestions, setFilteredClusterSuggestions] =
    React.useState(clusterSuggestions);
  const [filteredPodSuggestions, setFilteredPodSuggestions] =
    React.useState(podSuggestions);
  const [filteredAppSuggestions, setFilteredAppSuggestions] =
    React.useState(appSuggestions);
  const [filteredFileSuggestions, setFilteredFileSuggestions] =
    React.useState(fileSuggestions);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const downloadURLRef = React.useRef(null);
  const [isValidURL, setIsValidURL] = React.useState(false);
  const [isParsingURL, setIsParsingURL] = React.useState(false);
  const [parsingURLStatus, setParsingURLStatus] = React.useState("");

  React.useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3001/clusters");
    const data = await response.json();
    setClusterSuggestions(data);
    setFilteredClusterSuggestions(data);
    setIsLoading(false);
  };

  const fetchApps = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3001/apps");
    const data = await response.json();
    setAppSuggestions(data);
    setFilteredAppSuggestions(data);
    setIsLoading(false);
  };

  const fetchPods = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3001/pods");
    const data = await response.json();
    setPodSuggestions(data);
    setFilteredPodSuggestions(data);
    setIsLoading(false);
  };

  const fetchFiles = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3001/files");
    const data = await response.json();
    setFileSuggestions(data);
    setFilteredFileSuggestions(data);
    setIsLoading(false);
  };

  const generateDownloadURL = () => {
    const cluster = clusterRef.current.value;
    const app = appRef.current.value;
    const date = dateRef.current.value;
    const time = timeRef.current.value;
    const pod = podRef.current.value;
    const files = selectedFiles.join(",");
    const url = encodeURI(
      `http://localhost:3001/download?cluster=${cluster}&app=${app}&date=${date}&time=${time}&pod=${pod}&files=${files}`
    );
    if (!cluster || !app || !date || !time || !pod || !files) {
      setIsValidURL(false);
    } else {
      setIsValidURL(true);
    }
    downloadURLRef.current.value = url;
    return url;
  };

  const handleURLChange = () => {
    // extract data from url
    try {
      const url = new URL(downloadURLRef.current.value);
      const cluster = url.searchParams.get("cluster");
      const app = url.searchParams.get("app");
      const date = url.searchParams.get("date");
      const time = url.searchParams.get("time");
      const pod = url.searchParams.get("pod");
      const files = url.searchParams.get("files").split(",");
      if (!cluster || !app || !date || !time || !pod || !files)
        throw new Error("Invalid URL");
      // fetch data from server with debouncing
      setIsParsingURL(true);
      setIsParsingURL(true);
      setParsingURLStatus("Fetching Clusters...");
      fetchClusters().then(() => {
        clusterRef.current.value = cluster;
        setParsingURLStatus("Fetching Apps...");
        fetchApps().then(() => {
          appRef.current.value = app;
          dateRef.current.value = date;
          timeRef.current.value = time;
          setParsingURLStatus("Fetching Pods...");
          fetchPods().then(() => {
            podRef.current.value = pod;
            setParsingURLStatus("Fetching Files...");
            fetchFiles().then(() => {
              setSelectedFiles(files);
              setIsParsingURL(false);
              setParsingURLStatus("");
            });
          });
        });
      });
      setIsValidURL(true);
    } catch (err) {
      setIsValidURL(false);
      setIsParsingURL(false);
      setParsingURLStatus("");
    }
  };

  const handleDownload = () => {
    const url = downloadURLRef.current.value;
    if (isValidURL) {
      const decodedURL = decodeURI(url);
      const files = decodedURL.split("files=")[1].split(",");
      files.forEach((file) => {
        const a = document.createElement("a");
        a.href = `http://localhost:3001/download?cluster=${clusterRef.current.value}&app=${appRef.current.value}&date=${dateRef.current.value}&time=${timeRef.current.value}&pod=${podRef.current.value}&files=${file}`;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  };

  const handleFileSelect = (e) => {
    const selectedFileName = e.target.value;
    if (selectedFileName === "select-all") {
      if (e.target.checked) {
        setSelectedFiles(filteredFileSuggestions.map((file) => file.fileName));
      } else {
        setSelectedFiles([]);
      }
    } else {
      if (e.target.checked) {
        setSelectedFiles([...selectedFiles, selectedFileName]);
      } else {
        setSelectedFiles(
          selectedFiles.filter((fileName) => fileName !== selectedFileName)
        );
      }
    }
  };

  useEffect(() => {
    generateDownloadURL();
  }, [
    clusterRef.current?.value,
    appRef.current?.value,
    dateRef.current?.value,
    timeRef.current?.value,
    podRef.current?.value,
    selectedFiles,
  ]);

  const value = {
    clusterRef,
    appRef,
    dateRef,
    timeRef,
    podRef,
    fileRef,
    clusterSuggestions,
    appSuggestions,
    podSuggestions,
    fileSuggestions,
    isLoading,
    filteredClusterSuggestions,
    filteredPodSuggestions,
    filteredAppSuggestions,
    filteredFileSuggestions,
    setFilteredClusterSuggestions,
    setFilteredPodSuggestions,
    setFilteredAppSuggestions,
    setFilteredFileSuggestions,
    fetchClusters,
    fetchApps,
    fetchPods,
    fetchFiles,
    handleFileSelect,
    selectedFiles,
    handleDownload,
    handleURLChange,
    downloadURLRef,
    isValidURL,
    generateDownloadURL,
    isParsingURL,
    parsingURLStatus,
  };
  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
};

export default LogsProvider;
