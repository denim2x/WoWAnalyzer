import React from 'react';
import PropTypes from 'prop-types';

import fetchWcl from 'common/fetchWclApi';

import ManaStyles from 'interface/others/ManaStyles.js';
import ManaLevelGraph from 'interface/others/charts/ManaLevelGraph';

class Mana extends React.PureComponent {
  static propTypes = {
    reportCode: PropTypes.string.isRequired,
    actorId: PropTypes.number.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    manaUpdates: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.state = {
      bossHealth: null,
    };
  }

  componentWillMount() {
    this.load(this.props.reportCode, this.props.actorId, this.props.start, this.props.end);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.reportCode !== this.props.reportCode || newProps.actorId !== this.props.actorId || newProps.start !== this.props.start || newProps.end !== this.props.end) {
      this.load(newProps.reportCode, newProps.actorId, newProps.start, newProps.end);
    }
  }

  load(reportCode, actorId, start, end) {
    return fetchWcl(`report/tables/resources/${reportCode}`, {
      start,
      end,
      sourceclass: 'Boss',
      hostility: 1,
      abilityid: 1000,
    })
      .then(json => {
        this.setState({
          bossHealth: json,
        });
      });
  }

  render() {
    if (!this.state.bossHealth) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    const { start, end, manaUpdates } = this.props;

    const mana = [{ x: start, y: 100 }]; // start with full mana
    mana.push(...manaUpdates.map(({ timestamp, current, max }) => {
      const x = Math.max(timestamp, start);
      return {
        x,
        y: (current / max) * 100,
      };
    }));

    const bossData = this.state.bossHealth.series.map((series, i) => {
      const data = series.data.map(([timestamp, health]) => ({ x: timestamp, y: health }));
      const style = ManaStyles[`Boss-${i}`] || { backgroundColor: 'transparent', borderColor: 'transparent' };

      return {
        id: series.id,
        title: `${series.name} Health`,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        data,
      };
    });

    let deaths = [];
    if (this.state.bossHealth.deaths) {
      deaths = this.state.bossHealth.deaths
        .filter(death => !!death.targetIsFriendly)
        .map(({ timestamp }) => ({
          x: timestamp,
        }));
    }

    return (
      <div className="graph-container">
        <ManaLevelGraph
          mana={mana}
          bossData={bossData}
          deaths={deaths}
          startTime={start}
          endTime={end}
        />
      </div>
    );
  }
}

export default Mana;

