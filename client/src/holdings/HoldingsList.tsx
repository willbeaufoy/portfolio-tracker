import './HoldingsList.css';
import API, {Holding, Trade, Performance} from '../api';
import React, {useEffect, useState} from 'react';
import {getTotalPerformance, setHoldingPerformance} from './utils';
import AddHoldingForm from './AddHoldingForm';
import AddTrade from './AddTradeDialog';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PerformanceDisplay from './PerformanceDisplay';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TradesList from './TradesList';
import {User} from '../App';

export type HoldingsListProps = {
  user: User;
};

/** Displays of all the user's holdings with the option to add more. */
export default function HoldingsList(props: HoldingsListProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [totalPerf, setTotalPerf] = useState<Performance>({
    pricePaid: 0,
    currentValue: 0,
    valueChange: 0,
    percentChange: 0,
  });

  useEffect(() => {
    API.listHoldings(props.user.username).then(async (holdings) => {
      if (holdings.length) {
        for (const holding of holdings) {
          setHoldingPerformance(holding);
        }
        setHoldings(holdings);
        setTotalPerf(getTotalPerformance(holdings));
      }
      setIsDataLoaded(true);
    });
  }, [props.user.username]);

  const [open, setOpen] = React.useState(holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };

  const addHolding = (holding: Holding) => {
    holdings.push(holding);
    setHoldings([...holdings]);
  };

  const deleteHolding = async (id: number, holdingIndex: number) => {
    try {
      await API.deleteHolding(id);
      holdings.splice(holdingIndex, 1);
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  };

  const addTrade = (trade: Trade, holdingIndex: number) => {
    if (!holdings[holdingIndex].trades) return;
    holdings[holdingIndex].trades!.push(trade);
    setHoldings([...holdings]);
  };

  const deleteTrade = async (
    id: number,
    holdingIndex: number,
    tradeIndex: number,
  ) => {
    try {
      await API.deleteTrade(id);
      if (!holdings[holdingIndex].trades) return;
      holdings[holdingIndex].trades!.splice(tradeIndex, 1);
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isDataLoaded) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="HoldingsList">
      <h2>Holdings</h2>
      {totalPerf && (
        <div className="totalPerf">
          <div>
            Current value: <strong>£{totalPerf.currentValue.toFixed(2)}</strong>
          </div>
          <div>
            <div>Total Performance:</div>
            <PerformanceDisplay performance={totalPerf} />
          </div>
        </div>
      )}
      {Boolean(holdings.length) && (
        <TableContainer>
          <Table size="small" aria-label="Holdings table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Exchange</TableCell>
                <TableCell>Current Bid Price</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((h, i) => {
                return (
                  <React.Fragment key={i}>
                    <TableRow
                      className="Holding-row"
                      onClick={() => {
                        handleClick(i);
                      }}
                    >
                      <TableCell>
                        {h.name} ({h.symbol})
                      </TableCell>
                      <TableCell>{h.exchange}</TableCell>
                      <TableCell>
                        {h.currency} {h.price?.toFixed(2) ?? 0}
                      </TableCell>
                      <TableCell>
                        {h.performance && h.performance.currentValue.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {h.performance && (
                          <PerformanceDisplay performance={h.performance} />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => deleteHolding(h.id, i)}
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          borderBottom: 0,
                          paddingBottom: 0,
                          paddingTop: 0,
                        }}
                        colSpan={5}
                      >
                        <Collapse in={open[i]} timeout="auto" unmountOnExit>
                          <TradesList
                            holding={h}
                            onDeleteTradeClicked={(
                              id: number,
                              tradeIndex: number,
                            ) => {
                              deleteTrade(id, i, tradeIndex);
                            }}
                          ></TradesList>
                          <div className="AddTrade-button-container">
                            <AddTrade
                              holding={h}
                              onTradeCreated={(trade: Trade) =>
                                addTrade(trade, i)
                              }
                            ></AddTrade>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddHoldingForm
        username={props.user.username}
        onHoldingCreated={(h: Holding) => addHolding(h)}
      ></AddHoldingForm>
    </div>
  );
}
