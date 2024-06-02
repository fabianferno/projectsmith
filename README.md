# ProjectSmith

## Project Overview
ProjectSmith is a Chrome extension designed to enhance and expand the functionality of data-rich blockchain explorers like Beryx by integrating a conversational AI assistant and agent actions. This project leverages AI and blockchain technologies to provide users with an enriched experience when interacting with on-chain data.

## Key Components and Workflow

### Beryx Explorer
- **Function**: Serves as the primary user interface where users can view blockchain data such as addresses, contracts, and transactions.
- **User Interaction**: Users interact with the Beryx Explorer to view and query on-chain data.

### Smith Extension
- **Function**: Acts as the central hub of the ProjectSmith extension. It connects the user's wallet and integrates seamlessly with the Beryx Explorer.
- **Capabilities**: 
  - Reads page context, such as addresses and transaction data, from the Beryx API.
  - Opens up functionalities provided by Smith to run prompts and execute actions via AI.

### Beryx API
- **Function**: Provides the necessary data from the Beryx Explorer to the Smith extension. It supplies contextual information about the blockchain data being viewed.
- **Interaction**: The Smith extension fetches page context and relevant data through this API to process and enhance the user's experience.

### Galadriel
- **Function**: Runs large language model (LLM) prompts for various tasks.
- **Integration**: Smith sends data to Galadriel for processing, leveraging AI to understand and interact with the blockchain data meaningfully.

### CoopHive
- **Function**: Executes agent actions and interacts with decentralized finance (DeFi) protocols.
- **Agent Actions**: Runs agents based on prompts processed by Galadriel and validates these actions using AI.
- **DeFi Interaction**: Executes DeFi-related actions, such as transactions, via the Squid Router.

### Squid Router
- **Function**: Facilitates the actual DeFi actions, such as transactions or contract interactions, triggered by CoopHive.
- **Role**: Acts as a bridge between CoopHive and the blockchain for performing validated actions.

### LilyPad
- **Function**: Supports CoopHive by providing additional validation and interaction capabilities, ensuring that agent actions align with user intentions and DeFi protocols.

## Workflow Summary
1. **User Interaction with Beryx Explorer**: The user views blockchain data (addresses, contracts, transactions).
2. **Smith Extension Activation**: The Smith extension connects the user's wallet and reads page context and data from the Beryx API.
3. **Data Processing and AI Prompts**: Smith sends data to Galadriel to run LLM prompts, enhancing the contextual understanding of the data.
4. **Agent Execution**: Based on the processed data, Smith triggers agents on CoopHive to perform specific actions.
5. **DeFi Actions and Validation**: CoopHive calls LLMs for validation, executes actions via the Squid Router, and ensures correctness with LilyPad.
6. **Enhanced User Experience**: Users receive enriched and actionable insights directly within the Beryx Explorer interface, facilitated by the conversational AI assistant and automated agent actions.

## Conclusion
ProjectSmith integrates advanced AI and blockchain technologies to enhance user interaction with blockchain explorers. By combining data retrieval, AI processing, and automated actions, it provides a robust tool for users to engage with on-chain data efficiently and intelligently.

### Made with 💙 for HackFS 
