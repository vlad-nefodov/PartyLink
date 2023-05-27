import "./SearchPanel.scss";
import { FC, useState, ChangeEvent } from 'react';
import { Button, FormControl, InputGroup, FormCheck, Row, Col } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

export enum ShowEvents {
  All = 0,
  Hosting = 1,
  Community = 2
}

export interface ISearchPanelProps {
  showEvents: ShowEvents,
  onShowEventsChanged: (showEvents: ShowEvents) => void,
  onSearch: (input: string) => void
}

const SearchPanel: FC<ISearchPanelProps> = ({ showEvents, onShowEventsChanged, onSearch }) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const onSearchInputChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (!value) {
      onSearch(value);
    }
  }

  const onChangeShowEventsHandle = (showEvents: ShowEvents) => {
    onShowEventsChanged(showEvents);
    onSearch(searchInput);
  }

  return (
    <div className="search-panel">
      <div className="pt-3 ps-3 pe-3">
        <InputGroup>
          <FormControl
            value={searchInput}
            onChange={onSearchInputChangeHandle}
            placeholder="Search..."
          />
          <Button
            className="d-flex justify-content-center align-items-center"
            variant="outline-secondary"
            onClick={() => onSearch(searchInput)}>
            <FaSearch />
          </Button>
        </InputGroup>
        <Row className="justify-content-start ps-1 mt-2">
          <Col xs="auto" className="pe-0">
            <FormCheck
              inline
              type="radio"
              label="All"
              id="all"
              checked={showEvents == ShowEvents.All}
              onChange={() => onChangeShowEventsHandle(ShowEvents.All)} />
          </Col>
          <Col xs="auto" className="p-0">
            <FormCheck
              inline
              type="radio"
              label="Hosting"
              id="hosting"
              checked={showEvents == ShowEvents.Hosting}
              onChange={() => onChangeShowEventsHandle(ShowEvents.Hosting)} />
          </Col>
          <Col xs="auto" className="p-0">
            <FormCheck
              inline
              type="radio"
              label="Community"
              id="Community"
              checked={showEvents == ShowEvents.Community}
              onChange={() => onChangeShowEventsHandle(ShowEvents.Community)} />
          </Col>
        </Row>
      </div>
      <div className='form-controls-separator mt-2' />
    </div>
  );
}

export default SearchPanel;