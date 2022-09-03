// const tf = require('@tensorflow/tfjs-node-gpu');
const tf = require('@tensorflow/tfjs');

// const W = 21
// const H = 11

let zeros = (w, h, v = 0) => Array.from(new Array(h), _ => Array(w).fill(v));

export class A2CAgent {
    constructor(state_size, actions_size) {
        // public
        this.state_size = state_size;
        this.action_size = actions_size;
        this.value_size = 1;

        this.discount_factor = 0.99;
        this.actor_learningr = 0.002;
        this.critic_learningr = 0.005;

        this.actor = this.#build_actor();
        this.critic = this.#build_critic();

        this.mutex = false;
    }

    #build_actor() {
        const model = tf.sequential();

        model.add(tf.layers.dense({
            units: this.state_size,
            activation: 'relu',
            kernelInitializer: 'glorotUniform',
            inputShape: this.state_size, // input field state
        }));

        // model.add(tf.layers.dense({
        //     units: 256,
        // }));

        model.add(tf.layers.dense({
            units: 2*this.action_size,
        }));

        model.add(tf.layers.dense({
            units: this.action_size,
            activation: 'softmax',
            kernelInitializer: 'glorotUniform',
        }));

        console.log('Actor tf model');
        model.summary();

        model.compile({
            optimizer: tf.train.adam(this.actor_learningr),
            loss: tf.losses.softmaxCrossEntropy
        });

        return model;
    }

    #build_critic() {
        const model = tf.sequential();

        model.add(tf.layers.dense({
            units: this.state_size,
            activation: 'relu',
            kernelInitializer: 'glorotUniform',
            inputShape: this.state_size, // input field state
        }));

        // // model.add(tf.layers.flatten());
        // model.add(tf.layers.dense({
        //     units: 256,
        // }));

        // model.add(tf.layers.dense({
        //     units: 12,
        // }));

        model.add(tf.layers.dense({
            units: this.value_size,
            activation: 'linear',
            kernelInitializer: 'glorotUniform',
        }));

        console.log('Critic tf model');
        model.summary();

        model.compile({
            optimizer: tf.train.adam(this.critic_learningr),
            loss: tf.losses.meanSquaredError,
        });

        return model;
    }

    get_action(state) {
        state = tf.tensor2d(state, [1, this.state_size]);
        // state.print();

        let policy = this.actor.predict(state, {
            batchSize: 1,
        });
        // console.log(policy);

        let policy_flat = policy.dataSync();
        // console.log(policy_flat.join(", "));

        // do action
        let action_num = 0;
        for (let i = 0; i < policy_flat.length; i++) {
            if (policy_flat[i] > policy_flat[action_num])
                action_num = i;
        }
        return action_num;
        // this._actions[action_num]();
    }

    train(state, action, reward, nextState, done) {
        // while (this.mutex);
        // this.mutex = true;

        state = tf.tensor2d(state, [1, this.state_size]);

        let value = this.critic.predict(state).dataSync();
        
        let target = zeros(1, this.value_size);
        let advantages = zeros(1, this.action_size);
        
        nextState = tf.tensor2d(nextState, [1, this.state_size]);
        let next_value = this.critic.predict(nextState).dataSync();
        
        // console.log(`Critic predict value ${value} next value ${next_value} reward ${reward}`);
        // console.log(action) //Pb nbr d'actions dans advantages

        if (done) {
            advantages[action] = [reward - value];
            target[0] = reward;
        } else {
            advantages[action] = [reward + this.discount_factor * (next_value) - value];
            target[0] = reward + this.discount_factor * next_value;
        }

        return this.actor.fit(state, tf.tensor(advantages).reshape([1, this.action_size]), {
            epochs: 1,
        }).then(() =>{
            this.critic.fit(state, tf.tensor(target), {
                epochs: 1,
            });
            // this.mutex = false;
        }
        );

    }
}