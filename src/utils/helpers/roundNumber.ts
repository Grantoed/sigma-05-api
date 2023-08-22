const roundNumber = (value: number, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
};

export default roundNumber;
