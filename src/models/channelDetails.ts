import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
  PutItemCommand,
  UpdateItemCommand,
  ScanCommand,
  ScalarAttributeType,
  KeyType,
  ReturnConsumedCapacity,
  ScanCommandOutput,
  ReturnValue,
} from '@aws-sdk/client-dynamodb';
import {ChannelDetail} from './types';

const client = new DynamoDBClient();

const createTable = async () => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'ChannelName',
        AttributeType: ScalarAttributeType.S,
      },
    ],
    KeySchema: [
      {
        AttributeName: 'ChannelName',
        KeyType: KeyType.HASH,
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: process.env.CHANNELS_TABLE_NAME,
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

  const command = new CreateTableCommand(params);

  await client.send(command).then(() => {
    console.log('Created Table: ' + params.TableName);
  });
};

export const getJoinedChannels = async (): Promise<ChannelDetail[]> => {
  const input = {
    ExpressionAttributeValues: {
      ':a': {
        BOOL: true,
      },
    },
    FilterExpression: 'Active = :a',
    TableName: process.env.CHANNELS_TABLE_NAME,
  };
  const command = new ScanCommand(input);
  return await client.send(command).then((response: ScanCommandOutput) => {
    const channelDetails = [];

    if (response.Items) {
      for (let i = 0; i < response.Items.length; i++) {
        const channelInfo: ChannelDetail = {
          name: response.Items[i].ChannelName.S!,
          gptAccess: Boolean(response.Items[i].GPTAccess.BOOL!),
        };
        channelDetails.push(channelInfo);
      }
    }

    return channelDetails;
  });
};

export const addChannel = async (channelName: string) => {
  const input = {
    Item: {
      ChannelName: {
        S: channelName,
      },
      Active: {
        BOOL: true,
      },
      GPTAccess: {
        BOOL: false,
      },
    },
    ReturnConsumedCapacity: ReturnConsumedCapacity.TOTAL,
    TableName: process.env.CHANNELS_TABLE_NAME,
  };
  const command = new PutItemCommand(input);
  return await client.send(command);
};

export const removeChannel = async (channelName: string) => {
  const input = {
    ExpressionAttributeNames: {
      '#A': 'Active',
    },
    ExpressionAttributeValues: {
      ':a': {
        BOOL: false,
      },
    },
    Key: {
      ChannelName: {
        S: channelName,
      },
    },
    ReturnValues: ReturnValue.ALL_NEW,
    TableName: process.env.CHANNELS_TABLE_NAME,
    UpdateExpression: 'SET #A = :a',
  };
  const command = new UpdateItemCommand(input);
  return await client.send(command);
};

export const updateGPTAccess = async (
  channelName: string,
  gptAccess: boolean
) => {
  const input = {
    ExpressionAttributeNames: {
      '#G': 'GPTAccess',
    },
    ExpressionAttributeValues: {
      ':g': {
        BOOL: gptAccess,
      },
    },
    Key: {
      ChannelName: {
        S: channelName,
      },
    },
    ReturnValues: ReturnValue.ALL_NEW,
    TableName: process.env.CHANNELS_TABLE_NAME,
    UpdateExpression: 'SET #G = :g',
  };
  const command = new UpdateItemCommand(input);
  return await client.send(command);
};

export const initDatabase = async () => {
  const input = {
    // DescribeTableInput
    TableName: process.env.CHANNELS_TABLE_NAME, // required
  };
  const command = new DescribeTableCommand(input);
  await client
    .send(command)
    .then(() => {
      console.log('Table exists!');
    })
    .catch(err => {
      if (err.name === 'ResourceNotFoundException') {
        createTable();
      } else {
        console.log('Error connecting to dynamo db: ' + err);
      }
    });
};
