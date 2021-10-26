/* eslint-disable no-useless-escape */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_qFHmY8UZ0H1RsexDyedFHicyeSZ41Q0CVYnL9qvmtGp" });

exports.createBrainstormSpaceDaily = functions.pubsub.schedule("1 0 * * *").timeZone("Europe/London").onRun((context) => {
    const blockId = "103af17d47e647a3bc9b5aa3c6e7b24e";
    const date = new Date().toLocaleDateString("en-GB");
    notion.blocks.children.append({
        block_id: blockId,
        children: [
            {
                object: "block",
                type: "toggle",
                toggle: {
                    text: [{
                        type: "text",
                        text: {
                            "content": date,
                            "link": null,
                        },
                        annotations: {
                            bold: true,
                            underline: true,
                        },
                    }],
                },
            },
        ],
    });
});
