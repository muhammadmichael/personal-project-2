module.exports = (sequelize, Sequelize) => {
    const Komentar = sequelize.define("komentar", {
        text: {
            type: Sequelize.STRING
        },
    });

    return Komentar;
}