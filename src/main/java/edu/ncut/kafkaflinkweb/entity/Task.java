package edu.ncut.kafkaflinkweb.entity;

import javax.persistence.Entity;


public class Task {
    public String ip;
    public String inTopic;
    public String outTopic;

    public Task() {
    }

    public Task(String ip, String inTopic, String outTopic) {
        this.ip = ip;
        this.inTopic = inTopic;
        this.outTopic = outTopic;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getInTopic() {
        return inTopic;
    }

    public void setInTopic(String inTopic) {
        this.inTopic = inTopic;
    }

    public String getOutTopic() {
        return outTopic;
    }

    public void setOutTopic(String outTopic) {
        this.outTopic = outTopic;
    }

    @Override
    public String toString() {
        return "Task{" +
                "ip='" + ip + '\'' +
                ", inTopic='" + inTopic + '\'' +
                ", outTopic='" + outTopic + '\'' +
                '}';
    }
}
