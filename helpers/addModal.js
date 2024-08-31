module.exports = async (sourceInteraction, modal, timeout = 900000) => {
    try {
        await sourceInteraction.showModal(modal)
        return await sourceInteraction.awaitModalSubmit({
            time: timeout,
            filter: (filterInteraction) =>
                filterInteraction.customId === `modal-${sourceInteraction.id}`,
        })
    } catch(e) {  }
}