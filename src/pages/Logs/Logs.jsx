import React, { useEffect } from "react";
import styles from "./Logs.module.css";
import { useLogs } from "../../context/Logs";

const Logs = () => {
  const {
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
    setFilteredClusterSuggestions,
    setFilteredPodSuggestions,
    setFilteredAppSuggestions,
    setFilteredFileSuggestions,
    filteredClusterSuggestions,
    filteredPodSuggestions,
    filteredAppSuggestions,
    filteredFileSuggestions,
    fetchApps,
    fetchPods,
    fetchFiles,
    handleFileSelect,
    selectedFiles,
    handleDownload,
    handleURLChange,
    downloadURLRef,
    generateDownloadURL,
    isValidURL,
    isParsingURL,
    parsingURLStatus,
  } = useLogs();
  const [focusedInput, setFocusedInput] = React.useState(null);

  const handleClusterChange = () => {
    if (clusterRef.current) {
      const filteredSuggestions = clusterSuggestions.filter((suggestion) =>
        suggestion
          .toLowerCase()
          .includes(clusterRef.current.value.toLowerCase())
      );
      setFilteredClusterSuggestions(filteredSuggestions);
    }
  };

  const handlePodChange = () => {
    if (podRef.current) {
      const filteredSuggestions = podSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(podRef.current.value.toLowerCase())
      );
      setFilteredPodSuggestions(filteredSuggestions);
    }
  };

  const handleAppChange = () => {
    if (appRef.current) {
      const filteredSuggestions = appSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(appRef.current.value.toLowerCase())
      );
      setFilteredAppSuggestions(filteredSuggestions);
    }
  };

  const handleFileChange = () => {
    if (fileRef.current) {
      const filteredSuggestions = fileSuggestions.filter((suggestion) =>
        suggestion.fileName
          .toLowerCase()
          .includes(fileRef.current.value.toLowerCase())
      );
      setFilteredFileSuggestions(filteredSuggestions);
    }
  };

  const handleFocus = (e) => {
    setFocusedInput(e.target.id);
  };

  const areAllFilteredFilesSelected = () => {
    for (let i = 0; i < filteredFileSuggestions.length; i++) {
      if (!selectedFiles.includes(filteredFileSuggestions[i].fileName)) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Logs</h1>
      <div className={styles.top}>
        <div className={styles.inputGroup}>
          <label htmlFor="cluster">Cluster</label>
          <input
            type="text"
            id="cluster"
            ref={clusterRef}
            placeholder="Enter Cluster"
            onFocus={handleFocus}
            onChange={handleClusterChange}
            autoComplete="off"
          />
          {focusedInput === "cluster" && (
            <Suggestions
              suggestions={filteredClusterSuggestions}
              isLoading={isLoading}
              inputRef={clusterRef}
              close={() => setFocusedInput(null)}
              highlight={clusterRef.current?.value}
              onClick={fetchApps}
            />
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="app">App</label>
          <input
            type="text"
            id="app"
            ref={appRef}
            placeholder="Enter App"
            onFocus={handleFocus}
            onChange={handleAppChange}
            autoComplete="off"
            disabled={!clusterRef.current?.value}
          />
          {focusedInput === "app" && (
            <Suggestions
              suggestions={filteredAppSuggestions}
              isLoading={isLoading}
              inputRef={appRef}
              close={() => setFocusedInput(null)}
              highlight={appRef.current?.value}
              onClick={fetchPods}
            />
          )}
        </div>
        <div className={styles.inputGroup}>
          <DateInput
            dateRef={dateRef}
            handleFocus={handleFocus}
            disabled={!appRef.current?.value}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="time">Time</label>
          <input
            type="number"
            id="time"
            ref={timeRef}
            placeholder="Enter Time"
            min="0"
            max="23"
            step="1"
            onInput={(e) => {
              if (e.target.value > 23) e.target.value = 23;
              if (e.target.value < 0) e.target.value = 0;
              // format input to 2 digits
              e.target.value = ("0" + e.target.value).slice(-2);
            }}
            onFocus={handleFocus}
            autoComplete="off"
            disabled={!appRef.current?.value}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="pod">Pod</label>
          <input
            type="text"
            id="pod"
            ref={podRef}
            placeholder="Enter Pod"
            onFocus={handleFocus}
            onChange={handlePodChange}
            autoComplete="off"
            disabled={!appRef.current?.value}
          />
          {focusedInput === "pod" && (
            <Suggestions
              suggestions={filteredPodSuggestions}
              isLoading={isLoading}
              inputRef={podRef}
              close={() => setFocusedInput(null)}
              highlight={podRef.current?.value}
              onClick={fetchFiles}
            />
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="file">File</label>
          <input
            type="text"
            id="file"
            ref={fileRef}
            placeholder="Enter File"
            onFocus={handleFocus}
            onChange={handleFileChange}
            autoComplete="off"
            disabled={!podRef.current?.value}
          />
          {selectedFiles.length > 0 && (
            <span className={styles.selectedFiles}>
              {selectedFiles.length} files selected
            </span>
          )}
          {focusedInput === "file" && (
            <ul className={styles.multiselect_suggestions}>
              {isLoading ? (
                <div className={styles.loading}>Loading...</div>
              ) : (
                <>
                  <li className={styles.multiselect} key="select-all">
                    <input
                      type="checkbox"
                      id={"select-all"}
                      name={"select-all"}
                      value={"select-all"}
                      onChange={handleFileSelect}
                      checked={
                        areAllFilteredFilesSelected() &&
                        filteredFileSuggestions.length > 0
                      }
                    />
                    <label htmlFor="select-all">
                      Select All {`(`}
                      <span
                        style={{
                          color: "hsl(219, 100%, 57%)",
                          fontWeight: "bold",
                        }}
                      >{`${selectedFiles.length}`}</span>
                      {`/${filteredFileSuggestions.length})`}
                    </label>
                  </li>
                  {filteredFileSuggestions?.map((suggestion) => (
                    <li
                      className={styles.multiselect}
                      key={suggestion.fileName}
                    >
                      <input
                        type="checkbox"
                        id={suggestion.fileName}
                        name={suggestion.fileName}
                        value={suggestion.fileName}
                        onChange={handleFileSelect}
                        checked={selectedFiles.includes(suggestion.fileName)}
                      />
                      <label htmlFor={suggestion.fileName}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              suggestion.fileName.replace(
                                new RegExp(fileRef.current?.value, "gi"),
                                (match) => `<mark>${match}</mark>`
                              ) +
                              " - " +
                              convertSecondsToTime(suggestion.lastModifiedOn),
                          }}
                        />
                      </label>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
      </div>
      <h2 className={styles.subheading}>Actions</h2>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={handleDownload}
          disabled={!isValidURL}
        >
          Download
        </button>
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            generateDownloadURL();
            navigator.clipboard.writeText(downloadURLRef.current.value);
            alert("URL copied to clipboard");
          }}
          disabled={!isValidURL}
        >
          Copy URL
        </button>
        <div className={styles.parsingStatus}>
          {isParsingURL && parsingURLStatus}
        </div>
      </div>
      <h2 className={styles.subheading}>URL</h2>
      <div className={styles.url}>
        <input
          type="url"
          ref={downloadURLRef}
          placeholder="Enter URL"
          className={styles.url_input}
          onChange={handleURLChange}
        />
        <span className={styles.url_error}>{!isValidURL && "Invalid URL"}</span>
      </div>
    </div>
  );
};

// convert datetime seconds to format HH:MM:SS
const convertSecondsToTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
};

const DateInput = ({ dateRef, handleFocus, disabled }) => {
  const [error, setError] = React.useState(false);

  const handleDateChange = (e) => {
    // check the format of the date dd.mm.yyyy
    // also check if the date is valid
    // also check if the date is not in the future
    // also check for 29th feb in leap years
    const date = e.target.value;
    const dateRegex = /^([0-2][0-9]|(3)[0-1])(\.)(0[1-9]|1[0-2])(\.)(\d{4})$/;
    const dateParts = date.split(".");
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const year = parseInt(dateParts[2]);
    if (
      (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) &&
      month == 2 &&
      day > 29
    ) {
      return setError(true);
    } else if (
      !(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) &&
      month == 2 &&
      day > 28
    ) {
      return setError(true);
    }
    const isValidDate = (d) => {
      return d instanceof Date && !isNaN(d);
    };
    const isValid =
      dateRegex.test(date) &&
      isValidDate(new Date(year, month - 1, day)) &&
      new Date(year, month - 1, day) <= new Date();
    setError(!isValid);
  };

  return (
    <>
      <label
        htmlFor="date"
        style={{ color: error ? "red" : "hsl(219, 100%, 57%)" }}
      >
        Date
      </label>
      <input
        type="text"
        id="date"
        ref={dateRef}
        placeholder="dd.mm.yyyy"
        onChange={handleDateChange}
        onFocus={handleFocus}
        autoComplete="off"
        disabled={disabled}
      />
    </>
  );
};

const Suggestions = ({
  inputRef,
  suggestions,
  isLoading,
  close,
  highlight,
  onClick,
}) => {
  const suggestionsRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionsRef]);

  return (
    <ul ref={suggestionsRef} className={styles.suggestions}>
      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : suggestions?.length > 0 ? (
        suggestions?.map((suggestion) => (
          <li
            className={styles.suggestion}
            key={suggestion + Math.random()}
            onClick={() => {
              inputRef.current.value = suggestion;
              onClick && onClick();
              close();
            }}
          >
            {
              <span
                dangerouslySetInnerHTML={{
                  __html: suggestion.replace(
                    new RegExp(highlight, "gi"),
                    (match) => `<mark>${match}</mark>`
                  ),
                }}
              />
            }
          </li>
        ))
      ) : (
        <div className={styles.loading}>No suggestions found</div>
      )}
    </ul>
  );
};

export default Logs;
