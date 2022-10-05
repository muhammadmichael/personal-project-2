module.exports = (sequelize, Sequelize) => {
    const Berita = sequelize.define("berita", {
        title: {
            type: Sequelize.STRING
        },
        highlight: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        },
        isDelete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });

    return Berita;
}